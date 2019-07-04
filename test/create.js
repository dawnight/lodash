import assert from 'assert';
import lodashStable from 'lodash';
import { falsey, stubObject, primitives, stubTrue } from './utils.js';
import create from '../create.js';
import keys from '../keys.js';

describe('create', () => {
  function Shape() {
    this.x = 0;
    this.y = 0;
  }

  function Circle() {
    Shape.call(this);
  }

  it('should create an object that inherits from the given `prototype` object', () => {
    Circle.prototype = create(Shape.prototype);
    Circle.prototype.constructor = Circle;

    const actual = new Circle;

    assert.ok(actual instanceof Circle);
    assert.ok(actual instanceof Shape);
    assert.notStrictEqual(Circle.prototype, Shape.prototype);
  });

  it('should assign `properties` to the created object', () => {
    const expected = { 'constructor': Circle, 'radius': 0 };
    Circle.prototype = create(Shape.prototype, expected);

    const actual = new Circle;

    assert.ok(actual instanceof Circle);
    assert.ok(actual instanceof Shape);
    assert.deepStrictEqual(Circle.prototype, expected);
  });

  it('should assign own properties', () => {
    function Foo() {
      this.a = 1;
      this.c = 3;
    }
    Foo.prototype.b = 2;

    assert.deepStrictEqual(create({}, new Foo), { 'a': 1, 'c': 3 });
  });

  it('should assign properties that shadow those of `prototype`', () => {
    function Foo() {
      this.a = 1;
    }
    const object = create(new Foo, { 'a': 1 });
    assert.deepStrictEqual(lodashStable.keys(object), ['a']);
  });

  it('should accept a falsey `prototype`', () => {
    const expected = lodashStable.map(falsey, stubObject);

    const actual = lodashStable.map(falsey, (prototype, index) => index ? create(prototype) : create());

    assert.deepStrictEqual(actual, expected);
  });

  it('should ignore a primitive `prototype` and use an empty object instead', () => {
    const expected = lodashStable.map(primitives, stubTrue);

    const actual = lodashStable.map(primitives, (value, index) => lodashStable.isPlainObject(index ? create(value) : create()));

    assert.deepStrictEqual(actual, expected);
  });

  it('should work as an iteratee for methods like `_.map`', () => {
    let array = [{ 'a': 1 }, { 'a': 1 }, { 'a': 1 }],
      expected = lodashStable.map(array, stubTrue),
      objects = lodashStable.map(array, create);

    const actual = lodashStable.map(objects, (object) => object.a === 1 && !keys(object).length);

    assert.deepStrictEqual(actual, expected);
  });
});
