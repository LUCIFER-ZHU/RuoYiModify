/**
 * 路径匹配器
 * @param {string} pattern
 * @param {string} path
 * @returns {Boolean}
 */
export function isPathMatch(pattern, path) {
  const regexPattern = pattern.replace(/\//g, '\\/').replace(/\*\*/g, '.*').replace(/\*/g, '[^\\/]*')
  const regex = new RegExp(`^${regexPattern}$`)
  return regex.test(path)
}

/**
 * 判断value字符串是否为空 
 * @param {string} value
 * @returns {Boolean}
 */
export function isEmpty(value) {
  if (value == null || value == "" || value == undefined || value == "undefined") {
    return true
  }
  return false
}

/**
 * 判断url是否是http或https 
 * @param {string} url
 * @returns {Boolean}
 */
export function isHttp(url) {
  return url.indexOf('http://') !== -1 || url.indexOf('https://') !== -1
}

/**
 * 判断path是否为外链
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}

/**
 * @param {string} url
 * @returns {Boolean}
 */
export function validURL(url) {
  const reg = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return reg.test(url)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validLowerCase(str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUpperCase(str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validAlphabets(str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}

/**
 * @param {string} email
 * @returns {Boolean}
 */
export function validEmail(email) {
  // eslint-disable-next-line no-useless-escape
  const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}(\.[0-9]{1,3}){3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return reg.test(email)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function isString(str) {
  return typeof str === 'string' || str instanceof String
}

/**
 * @param {Array} arg
 * @returns {Boolean}
 */
export function isArray(arg) {
  if (typeof Array.isArray === 'undefined') {
    return Object.prototype.toString.call(arg) === '[object Array]'
  }
  return Array.isArray(arg)
}

/**
 * 聚合表单校验错误消息
 * 将 Element Plus 的 validate 回调中的 fields 转为去重后的消息数组
 * @param {Record<string, Array<{message: string}>>} fields - 表单错误字段集合
 * @param {string} separator - 连接符，默认中文顿号“、”
 * @returns {{messages: string[], joined: string}} 去重后的消息数组与拼接字符串
 */
export function aggregateElFormErrors(fields, separator = '、') {
  const messages = []
  if (fields) {
    Object.keys(fields).forEach((key) => {
      const errs = fields[key] || []
      errs.forEach(e => {
        if (e && e.message) messages.push(e.message)
      })
    })
  }
  const uniqueMsgs = Array.from(new Set(messages))
  return { messages: uniqueMsgs, joined: uniqueMsgs.join(separator) }
}

/**
 * 包装 Element Plus 表单校验，返回聚合后的错误信息
 * 不在此处做 UI 提示，保持工具纯净，由调用方决定如何提示
 * @param {any} formRef - el-form 的 ref
 * @param {string} separator - 连接符，默认中文顿号“、”
 * @returns {Promise<{valid: boolean, fields?: object, messages: string[], joined: string}>}
 */
export function validateAndCollect(formRef, separator = '、') {
  return new Promise((resolve) => {
    if (!formRef || typeof formRef.validate !== 'function') {
      resolve({ valid: true, messages: [], joined: '' })
      return
    }
    formRef.validate((valid, fields) => {
      if (valid) {
        resolve({ valid: true, messages: [], joined: '' })
      } else {
        const { messages, joined } = aggregateElFormErrors(fields, separator)
        resolve({ valid: false, fields, messages, joined })
      }
    })
  })
}