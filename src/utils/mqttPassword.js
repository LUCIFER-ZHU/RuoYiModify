/**
 * MQTT 密码安全下发工具
 * @description 一次性 RSA 密钥协商 + AES-256-GCM 本地解密（jsencrypt + node-forge，不依赖 Web Crypto）
 * @author ERP System
 */

// JSEncrypt (RSA 公钥加密)
import JSEncrypt from "jsencrypt/bin/jsencrypt.min";
// node-forge (随机数 / Base64 / AES-GCM)
import forge from "node-forge";
import {
  getDeviceRsaPublicKey,
  getEncryptedMqttPassword,
} from "@/api/Website/machine";

/** AES-256 密钥字节数 */
const AES_KEY_BYTES = 32;
/** GCM nonce 长度（字节） */
const GCM_NONCE_BYTES = 12;
/** GCM tag 长度（字节） */
const GCM_TAG_BYTES = 16;

/**
 * 生成随机 AES-256 密钥（二进制字符串）
 * @returns {string} - 32 字节二进制字符串
 */
function generateAesKey() {
  return forge.random.getBytesSync(AES_KEY_BYTES);
}

/**
 * 用临时 RSA 公钥加密 AES 密钥的 Base64，得到 X-RSA-KEY 请求头值
 * @param {string} publicKeyPem - 接口一返回的 X.509 公钥 PEM
 * @param {string} keyBase64 - AES 密钥的 Base64（44 字符）
 * @returns {string} - Base64(RSA密文)，即 X-RSA-KEY
 * @throws {Error} - RSA 加密失败时抛出
 */
function encryptAesKeyWithRsa(publicKeyPem, keyBase64) {
  const encryptor = new JSEncrypt();
  encryptor.setPublicKey(publicKeyPem);
  // JSEncrypt.encrypt 对明文做 RSA/PKCS1Padding，返回值为密文的 Base64
  const headerValue = encryptor.encrypt(keyBase64);
  if (!headerValue) {
    throw new Error("RSA 加密 AES 密钥失败，请重试");
  }
  return headerValue;
}

/**
 * AES-256-GCM 解密：data = Base64(nonce[12] || ciphertext || tag[16])
 * @param {string} encryptedBase64 - 接口二返回的 data
 * @param {string} aesKey - 32 字节 AES 密钥（二进制字符串）
 * @returns {string} - 明文 MQTT 密码
 * @throws {Error} - 密文格式错误或认证失败时抛出
 */
function decryptAesGcmPassword(encryptedBase64, aesKey) {
  const raw = forge.util.decode64(encryptedBase64 || "");
  if (!raw || raw.length <= GCM_NONCE_BYTES + GCM_TAG_BYTES) {
    throw new Error("MQTT 密码密文格式异常");
  }
  const nonce = raw.substring(0, GCM_NONCE_BYTES);
  const tag = raw.substring(raw.length - GCM_TAG_BYTES);
  const ciphertext = raw.substring(GCM_NONCE_BYTES, raw.length - GCM_TAG_BYTES);

  const decipher = forge.cipher.createDecipher("AES-GCM", aesKey);
  decipher.start({
    iv: nonce,
    tagLength: 128,
    // 【关键修复】显式传入 'raw' 以避免 forge 误按 utf8 解析二进制字符串
    tag: forge.util.createBuffer(tag, "raw"),
  });
  decipher.update(forge.util.createBuffer(ciphertext));
  const ok = decipher.finish();
  if (!ok) {
    throw new Error("MQTT 密码解密失败，请重新尝试");
  }
  return decipher.output.toString("utf8");
}

/**
 * 按契约拉取并解密设备 MQTT 明文密码
 * @param {string} deviceId - 设备 UUID
 * @returns {Promise<string>} - 明文 MQTT 密码
 * @throws {Error} - 接口失败或解密失败时抛出
 */
export async function obtainMqttPasswordPlaintext(deviceId) {
  if (!deviceId) {
    throw new Error("设备 ID 不存在");
  }

  // 1. 申请一次性临时 RSA 公钥
  const rsaRes = await getDeviceRsaPublicKey(deviceId);
  const publicKeyPem = rsaRes && rsaRes.data;
  if (!publicKeyPem || typeof publicKeyPem !== "string") {
    throw new Error((rsaRes && rsaRes.message) || "获取临时公钥失败");
  }

  // 2. 本地生成 AES-256 密钥 K，并用临时公钥加密 KB64
  const aesKey = generateAesKey();
  const keyBase64 = forge.util.encode64(aesKey);
  const xRsaKey = encryptAesKeyWithRsa(publicKeyPem, keyBase64);

  // 3. 携带 X-RSA-KEY 获取 AES-GCM 密文
  const pwdRes = await getEncryptedMqttPassword(deviceId, xRsaKey);
  const encryptedBase64 = pwdRes && pwdRes.data;
  if (!encryptedBase64 || typeof encryptedBase64 !== "string") {
    throw new Error((pwdRes && pwdRes.message) || "获取 MQTT 密码失败");
  }

  // 4. 本地 AES-256-GCM 解密
  return decryptAesGcmPassword(encryptedBase64, aesKey);
}
