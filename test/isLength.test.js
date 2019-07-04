import assert from 'assert';
import lodashStable from 'lodash';
import { MAX_SAFE_INTEGER, stubTrue, stubFalse } from './utils.js';
import isLength from '../isLength.js';

describe('isLength', () => {
  it('should return `true` for lengths', () => {
    let values = [0, 3, MAX_SAFE_INTEGER],
      expected = lodashStable.map(values, stubTrue),
      actual = lodashStable.map(values, isLength);

    assert.deepStrictEqual(actual, expected);
  });

  it('should return `false` for non-lengths', () => {
    let values = [-1, '1', 1.1, MAX_SAFE_INTEGER + 1],
      expected = lodashStable.map(values, stubFalse),
      actual = lodashStable.map(values, isLength);

    assert.deepStrictEqual(actual, expected);
  });
});
