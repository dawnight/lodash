import assert from 'assert';
import lodashStable from 'lodash';
import { _, stubString } from './utils.js';

describe('"Strings" category methods', () => {
  const stringMethods = [
    'camelCase',
    'capitalize',
    'escape',
    'kebabCase',
    'lowerCase',
    'lowerFirst',
    'pad',
    'padEnd',
    'padStart',
    'repeat',
    'snakeCase',
    'toLower',
    'toUpper',
    'trim',
    'trimEnd',
    'trimStart',
    'truncate',
    'unescape',
    'upperCase',
    'upperFirst'
  ];

  lodashStable.each(stringMethods, (methodName) => {
    const func = _[methodName];

    it(`\`_.${methodName}\` should return an empty string for empty values`, () => {
      let values = [, null, undefined, ''],
        expected = lodashStable.map(values, stubString);

      const actual = lodashStable.map(values, (value, index) => index ? func(value) : func());

      assert.deepStrictEqual(actual, expected);
    });
  });
});
