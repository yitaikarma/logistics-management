/*
 * @Author       : Karma
 * @Date         : 2025-03-12 01:15:15
 * @LastEditTime : 2025-03-12 16:38:55
 * @LastEditors  : Karma
 * @Description  : 
 */
export function excludeFields<T, K extends keyof T>(
  obj: T, 
  keys: K[]
): Omit<T, K> {
  const result = { ...obj };
  keys.forEach(key => {
    delete result[key];
  });
  return result;
}
