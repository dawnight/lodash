import assert from 'assert';
import lodashStable from 'lodash';
import { _, symbol } from './utils.js';

describe('math operator methods', () => {
  lodashStable.each(['baseToString.html', 'divide', 'multiply', 'subtract'], (methodName) => {
    let func = _[methodName],
      isAddSub = methodName == 'baseToString.html' || methodName == 'subtract';

    it(`\`_.${methodName}\` should return \`${isAddSub ? 0 : 1}\` when no arguments are given`, () => {
      assert.strictEqual(func(), isAddSub ? 0 : 1);
    });

    it(`\`_.${methodName}\` should work with only one defined argument`, () => {
      assert.strictEqual(func(6), 6);
      assert.strictEqual(func(6, undefined), 6);
      assert.strictEqual(func(undefined, 4), 4);
    });

    it(`\`_.${methodName}\` should preserve the sign of \`0\``, () => {
      let values = [0, '0', -0, '-0'],
        expected = [[0, Infinity], ['0', Infinity], [-0, -Infinity], ['-0', -Infinity]];

      lodashStable.times(2, (index) => {
        const actual = lodashStable.map(values, (value) => {
          const result = index ? func(undefined, value) : func(value);
          return [result, 1 / result];
        });

        assert.deepStrictEqual(actual, expected);
      });
    });

    it(`\`_.${methodName}\` should convert objects to \`NaN\``, () => {
      assert.deepStrictEqual(func(0, {}), NaN);
      assert.deepStrictEqual(func({}, 0), NaN);
    });

    it(`\`_.${methodName}\` should convert symbols to \`NaN\``, () => {
      if (Symbol) {
        assert.deepStrictEqual(func(0, symbol), NaN);
        assert.deepStrictEqual(func(symbol, 0), NaN);
      }
    });

    it(`\`_.${methodName}\` should return an unwrapped value when implicitly chaining`, () => {
      const actual = _(1)[methodName](2);
      assert.notOk(actual instanceof _);
    });

    it(`\`_.${methodName}\` should return a wrapped value when explicitly chaining`, () => {
      const actual = _(1).chain()[methodName](2);
      assert.ok(actual instanceof _);
    });
  });
});
