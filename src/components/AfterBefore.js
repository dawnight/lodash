// import after from './lodash/after';
// import before from './lodash/before';

/**
 * @return {null}
 */
function AfterBefore() {
  function square(n) {
    return () => {
      let s = n > 0 ? n * n : 0;
      console.log('area: ', s);
    }
  }

  function after(n, func) {
    if (typeof func != 'function') {
      throw new TypeError('Expected a function');
    }
    return function (...args) {
      if (--n < 1) {
        return func.apply(this, args);
      }
    };
  }

  function before(n, func) {
    let result;
    if (typeof func != 'function') {
      throw new TypeError('Expected a function');
    }
    return function (...args) {
      if (--n > 0) {
        result = func.apply(this, args);
      }
      if (n <= 1) {
        func = undefined;
      }
      return result;
    };
  }

  let invokeFn = before(5, square(3));

  invokeFn();
  invokeFn();
  invokeFn();
  invokeFn();
  invokeFn();
  invokeFn();
  invokeFn();

  return null;
}

export default AfterBefore;
