/**
 * @return {null}
 */
function BaseToString() {

  function getTag(value) {
    if (value == null) {
      return value === undefined ? '[object Undefined]' : '[object Null]';
    }
    return toString.call(value);
  }

  function isSymbol(value) {
    const type = typeof value;
    return type === 'symbol' || (type === 'object' && value != null && getTag(value) === '[object Symbol]');
  }

  function baseToString(value) {

    if (typeof value == 'string') {
      return value;
    }
    if (Array.isArray(value)) {
      return `${value.map(baseToString)}`;
    }
    if (isSymbol(value)) {
      return symbolToString ? symbolToString.call(value) : '';
    }
    const result = `${value}`;
    return (result === '0' && (1 / value) === -INFINITY) ? '-0' : result;
  }

  const INFINITY = 1 / 0;

  const symbolToString = Symbol.prototype.toString;

  let list = [1, 2, 3, 4, [5, 6, 7, 8]];

  let res = baseToString(list);

  console.log(res);

  return null;
}


export default BaseToString;
