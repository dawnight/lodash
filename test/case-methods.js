import assert from 'assert';
import lodashStable from 'lodash';
import { _, stubTrue, burredLetters, deburredLetters } from './utils.js';
import camelCase from '../camelCase.js';
import kebabCase from '../kebabCase.js';
import lowerCase from '../lowerCase.js';
import snakeCase from '../snakeCase.js';
import startCase from '../startCase.js';

describe('case methods', () => {
  lodashStable.each(['camel', 'kebab', 'lower', 'snake', 'start', 'upper'], (caseName) => {
    let methodName = `${caseName}Case`,
      func = _[methodName];

    const strings = [
      'foo bar', 'Foo bar', 'foo Bar', 'Foo Bar',
      'FOO BAR', 'fooBar', '--foo-bar--', '__foo_bar__'
    ];

    const converted = (function() {
      switch (caseName) {
        case 'camel': return 'fooBar';
        case 'kebab': return 'foo-bar';
        case 'lower': return 'foo bar';
        case 'snake': return 'foo_bar';
        case 'start': return 'Foo Bar';
        case 'upper': return 'FOO BAR';
      }
    }());

    it(`\`_.${methodName}\` should convert \`string\` to ${caseName} case`, () => {
      const actual = lodashStable.map(strings, (string) => {
        const expected = (caseName == 'start' && string == 'FOO BAR') ? string : converted;
        return func(string) === expected;
      });

      assert.deepStrictEqual(actual, lodashStable.map(strings, stubTrue));
    });

    it(`\`_.${methodName}\` should handle double-converting strings`, () => {
      const actual = lodashStable.map(strings, (string) => {
        const expected = (caseName == 'start' && string == 'FOO BAR') ? string : converted;
        return func(func(string)) === expected;
      });

      assert.deepStrictEqual(actual, lodashStable.map(strings, stubTrue));
    });

    it(`\`_.${methodName}\` should deburr letters`, () => {
      const actual = lodashStable.map(burredLetters, (burred, index) => {
        let letter = deburredLetters[index].replace(/['\u2019]/g, '');
        if (caseName == 'start') {
          letter = letter == 'IJ' ? letter : lodashStable.capitalize(letter);
        } else if (caseName == 'upper') {
          letter = letter.toUpperCase();
        } else {
          letter = letter.toLowerCase();
        }
        return func(burred) === letter;
      });

      assert.deepStrictEqual(actual, lodashStable.map(burredLetters, stubTrue));
    });

    it(`\`_.${methodName}\` should remove contraction apostrophes`, () => {
      const postfixes = ['d', 'll', 'm', 're', 's', 't', 've'];

      lodashStable.each(["'", '\u2019'], (apos) => {
        const actual = lodashStable.map(postfixes, (postfix) => func(`a b${apos}${postfix} c`));

        const expected = lodashStable.map(postfixes, (postfix) => {
          switch (caseName) {
            case 'camel': return `aB${postfix}C`;
            case 'kebab': return `a-b${postfix}-c`;
            case 'lower': return `a b${postfix} c`;
            case 'snake': return `a_b${postfix}_c`;
            case 'start': return `A B${postfix} C`;
            case 'upper': return `A B${postfix.toUpperCase()} C`;
          }
        });

        assert.deepStrictEqual(actual, expected);
      });
    });

    it(`\`_.${methodName}\` should remove Latin mathematical operators`, () => {
      const actual = lodashStable.map(['\xd7', '\xf7'], func);
      assert.deepStrictEqual(actual, ['', '']);
    });

    it(`\`_.${methodName}\` should coerce \`string\` to a string`, () => {
      const string = 'foo bar';
      assert.strictEqual(func(Object(string)), converted);
      assert.strictEqual(func({ 'toString': lodashStable.constant(string) }), converted);
    });

    it(`\`_.${methodName}\` should return an unwrapped value implicitly when chaining`, () => {
      assert.strictEqual(_('foo bar')[methodName](), converted);
    });

    it(`\`_.${methodName}\` should return a wrapped value when explicitly chaining`, () => {
      assert.ok(_('foo bar').chain()[methodName]() instanceof _);
    });
  });

  (function() {
    it('should get the original value after cycling through all case methods', () => {
      const funcs = [camelCase, kebabCase, lowerCase, snakeCase, startCase, lowerCase, camelCase];

      const actual = lodashStable.reduce(funcs, (result, func) => func(result), 'enable 6h format');

      assert.strictEqual(actual, 'enable6HFormat');
    });
  })();
});
