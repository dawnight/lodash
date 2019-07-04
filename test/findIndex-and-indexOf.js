import assert from 'assert';
import lodashStable from 'lodash';
import { _, identity, stubZero, falsey } from './utils.js';

describe('findIndex and indexOf', () => {
  lodashStable.each(['findIndex', 'indexOf'], (methodName) => {
    let array = [1, 2, 3, 1, 2, 3],
      func = _[methodName],
      resolve = methodName == 'findIndex' ? lodashStable.curry(lodashStable.eq) : identity;

    it(`\`_.${methodName}\` should return the index of the first matched value`, () => {
      assert.strictEqual(func(array, resolve(3)), 2);
    });

    it(`\`_.${methodName}\` should work with a positive \`fromIndex\``, () => {
      assert.strictEqual(func(array, resolve(1), 2), 3);
    });

    it(`\`_.${methodName}\` should work with a \`fromIndex\` >= \`length\``, () => {
      let values = [6, 8, Math.pow(2, 32), Infinity],
        expected = lodashStable.map(values, lodashStable.constant([-1, -1, -1]));

      const actual = lodashStable.map(values, (fromIndex) => [
        func(array, resolve(undefined), fromIndex),
        func(array, resolve(1), fromIndex),
        func(array, resolve(''), fromIndex)
      ]);

      assert.deepStrictEqual(actual, expected);
    });

    it(`\`_.${methodName}\` should work with a negative \`fromIndex\``, () => {
      assert.strictEqual(func(array, resolve(2), -3), 4);
    });

    it(`\`_.${methodName}\` should work with a negative \`fromIndex\` <= \`-length\``, () => {
      let values = [-6, -8, -Infinity],
        expected = lodashStable.map(values, stubZero);

      const actual = lodashStable.map(values, (fromIndex) => func(array, resolve(1), fromIndex));

      assert.deepStrictEqual(actual, expected);
    });

    it(`\`_.${methodName}\` should treat falsey \`fromIndex\` values as \`0\``, () => {
      const expected = lodashStable.map(falsey, stubZero);

      const actual = lodashStable.map(falsey, (fromIndex) => func(array, resolve(1), fromIndex));

      assert.deepStrictEqual(actual, expected);
    });

    it(`\`_.${methodName}\` should coerce \`fromIndex\` to an integer`, () => {
      assert.strictEqual(func(array, resolve(2), 1.2), 1);
    });
  });
});
