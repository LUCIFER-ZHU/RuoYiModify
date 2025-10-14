/**
 * 金额精确计算工具类
 * 基于 decimal.js 实现，解决 JavaScript 浮点数精度问题
 * 适用于 ERP 系统中所有涉及金额、数量的计算场景
 * 
 * @module calculate
 * @requires decimal.js
 */

import Decimal from 'decimal.js';

/**
 * 安全转换为 Decimal 对象
 * @private
 * @param {number|string|Decimal} value - 待转换的值
 * @returns {Decimal} Decimal 对象
 */
function toDecimal(value) {
  if (value === null || value === undefined || value === '') {
    return new Decimal(0);
  }
  try {
    return new Decimal(value);
  } catch (error) {
    console.warn('[Calculate] 无效的数值:', value, '已转换为 0', error);
    return new Decimal(0);
  }
}

/**
 * 加法运算（支持多个数相加）
 * @param {...(number|string)} args - 待相加的数值
 * @returns {number} 计算结果
 * @example
 * add(0.1, 0.2); // 0.3
 * add(100, 200, 300); // 600
 * add('100.1234', '200.5678'); // 300.6912
 */
export function add(...args) {
  if (args.length === 0) return 0;
  
  let result = toDecimal(0);
  for (const value of args) {
    result = result.plus(toDecimal(value));
  }
  
  return result.toNumber();
}

/**
 * 减法运算
 * @param {number|string} minuend - 被减数
 * @param {number|string} subtrahend - 减数
 * @returns {number} 计算结果
 * @example
 * subtract(0.3, 0.1); // 0.2
 * subtract(100, 30.5678); // 69.4322
 */
export function subtract(minuend, subtrahend) {
  return toDecimal(minuend).minus(toDecimal(subtrahend)).toNumber();
}

/**
 * 乘法运算
 * @param {number|string} multiplicand - 被乘数
 * @param {number|string} multiplier - 乘数
 * @returns {number} 计算结果
 * @example
 * multiply(0.1, 0.2); // 0.02
 * multiply(123.45, 6.78); // 837.001
 */
export function multiply(multiplicand, multiplier) {
  return toDecimal(multiplicand).times(toDecimal(multiplier)).toNumber();
}

/**
 * 除法运算
 * @param {number|string} dividend - 被除数
 * @param {number|string} divisor - 除数
 * @returns {number} 计算结果
 * @throws {Error} 除数为 0 时抛出错误
 * @example
 * divide(0.3, 0.1); // 3
 * divide(100, 3); // 33.333333333333336
 */
export function divide(dividend, divisor) {
  const divisorDecimal = toDecimal(divisor);
  
  if (divisorDecimal.isZero()) {
    throw new Error('[Calculate] 除数不能为 0');
  }
  
  return toDecimal(dividend).dividedBy(divisorDecimal).toNumber();
}

// 默认导出
export default {
  add,
  subtract,
  multiply,
  divide
};
