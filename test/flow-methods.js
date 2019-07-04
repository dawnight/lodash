import assert from 'assert';
import lodashStable from 'lodash';
import { _, add, square, noop, identity, LARGE_ARRAY_SIZE, isEven, isNpm } from './utils.js';
import times from '../times.js';
import curry from '../curry.js';
import head from '../head.js';
import filter from '../filter.js';
import rearg from '../rearg.js';
import ary from '../ary.js';
import map from '../map.js';
import take from '../take.js';
import compact from '../compact.js';
import uniq from '../uniq.js';

describe('flow methods', () => {
  lodashStable.each(['flow', 'flowRight'], (methodName) => {
    let func = _[methodName],
      isFlow = methodName == 'flow';

    it(`\`_.${methodName}\` should supply each function with the return value of the previous`, () => {
      let fixed = function(n) { return n.toFixed(1); },
        combined = isFlow ? func(add, square, fixed) : func(fixed, square, add);

      assert.strictEqual(combined(1, 2), '9.0');
    });

    it(`\`_.${methodName}\` should return a new function`, () => {
      assert.notStrictEqual(func(noop), noop);
    });

    it(`\`_.${methodName}\` should return an identity function when no arguments are given`, () => {
      times(2, (index) => {
        try {
          var combined = index ? func([]) : func();
          assert.strictEqual(combined('a'), 'a');
        } catch (e) {
          assert.ok(false, e.message);
        }
        assert.strictEqual(combined.length, 0);
        assert.notStrictEqual(combined, identity);
      });
    });

    it(`\`_.${methodName}\` should work with a curried function and \`_.head\``, () => {
      const curried = curry(identity);

      const combined = isFlow
        ? func(head, curried)
        : func(curried, head);

      assert.strictEqual(combined([1]), 1);
    });

    it(`\`_.${methodName}\` should support shortcut fusion`, () => {
      let filterCount,
        mapCount,
        array = lodashStable.range(LARGE_ARRAY_SIZE),
        iteratee = function(value) { mapCount++; return square(value); },
        predicate = function(value) { filterCount++; return isEven(value); };

      lodashStable.times(2, (index) => {
        let filter1 = filter,
          filter2 = curry(rearg(ary(filter, 2), 1, 0), 2),
          filter3 = (filter = index ? filter2 : filter1, filter2(predicate));

        let map1 = map,
          map2 = curry(rearg(ary(map, 2), 1, 0), 2),
          map3 = (map = index ? map2 : map1, map2(iteratee));

        let take1 = take,
          take2 = curry(rearg(ary(take, 2), 1, 0), 2),
          take3 = (take = index ? take2 : take1, take2(2));

        const combined = isFlow
          ? func(map3, filter3, compact, take3)
          : func(take3, compact, filter3, map3);

        filterCount = mapCount = 0;
        assert.deepStrictEqual(combined(array), [4, 16]);

        if (!isNpm && WeakMap && WeakMap.name) {
          assert.strictEqual(filterCount, 5, 'filterCount');
          assert.strictEqual(mapCount, 5, 'mapCount');
        }
        filter = filter1;
        map = map1;
        take = take1;
      });
    });

    it(`\`_.${methodName}\` should work with curried functions with placeholders`, () => {
      let curried = curry(ary(map, 2), 2),
        getProp = curried(curried.placeholder, 'a'),
        objects = [{ 'a': 1 }, { 'a': 2 }, { 'a': 1 }];

      const combined = isFlow
        ? func(getProp, uniq)
        : func(uniq, getProp);

      assert.deepStrictEqual(combined(objects), [1, 2]);
    });

    it(`\`_.${methodName}\` should return a wrapped value when chaining`, () => {
      const wrapped = _(noop)[methodName]();
      assert.ok(wrapped instanceof _);
    });
  });
});
