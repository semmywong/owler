/*
 * @Author: Semmy Wong
 * @Date: 2022-09-20 23:30:15
 * @LastEditors: Semmy Wong
 * @LastEditTime: 2023-09-22 17:26:31
 * @Description: type utils
 */
import isNil from 'lodash/isNil';

const isType =
    <T>(type: string) =>
    (obj: unknown): obj is T =>
        toString.call(obj) === `[object ${type}]`;
export const isFn = isType<(...args: unknown[]) => unknown>('Function');
export const isArr = Array.isArray || isType<unknown[]>('Array');
export const isPlainObj = isType<object>('Object');
export const isStr = isType<string>('String');
export const isBool = isType<boolean>('Boolean');
export const isNum = isType<number>('Number');
export const isObj = (val: unknown): val is object => typeof val === 'object';
export const isRegExp = isType<RegExp>('RegExp');
export const isNumberLike = (t: string) => {
    return isNum(t) || /^(\d+)(\.\d+)?$/.test(t);
};
export function isEmptyObject(obj: Record<string, unknown> | string | number | undefined | null | unknown) {
    if (isNil(obj) || ((isPlainObj(obj) || isArr(obj) || isStr(obj)) && Object.keys(obj).length === 0)) {
        return true;
    }
    return false;
}
