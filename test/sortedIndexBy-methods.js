import assert from 'assert';
import lodashStable from 'lodash';
import { _, slice, MAX_ARRAY_LENGTH, MAX_ARRAY_INDEX } from './utils.js';

describe('sortedIndexBy methods', () => {
  lodashStable.each(['sortedIndexBy', 'sortedLastIndexBy'], (methodName) => {
    let func = _[methodName],
      isSortedIndexBy = methodName == 'sortedIndexBy';

    it(`\`_.${methodName}\` should provide correct \`iteratee\` arguments`, () => {
      let args;

      func([30, 50], 40, function() {
        args || (args = slice.call(arguments));
      });

      assert.deepStrictEqual(args, [40]);
    });

    it(`\`_.${methodName}\` should work with \`_.property\` shorthands`, () => {
      let objects = [{ 'x': 30 }, { 'x': 50 }],
        actual = func(objects, { 'x': 40 }, 'x');

      assert.strictEqual(actual, 1);
    });

    it(`\`_.${methodName}\` should support arrays larger than \`MAX_ARRAY_LENGTH / 2\``, () => {
      lodashStable.each([Math.ceil(MAX_ARRAY_LENGTH / 2), MAX_ARRAY_LENGTH], (length) => {
        let array = [],
          values = [MAX_ARRAY_LENGTH, NaN, undefined];

        array.length = length;

        lodashStable.each(values, (value) => {
          let steps = 0;

          const actual = func(array, value, (value) => {
            steps++;
            return value;
          });

          const expected = (isSortedIndexBy ? !lodashStable.isNaN(value) : lodashStable.isFinite(value))
            ? 0
            : Math.min(length, MAX_ARRAY_INDEX);

          assert.ok(steps == 32 || steps == 33);
          assert.strictEqual(actual, expected);
        });
      });
    });
  });
});
