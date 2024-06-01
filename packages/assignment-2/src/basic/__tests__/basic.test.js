import { describe, expect, it } from "vitest";
import { createNumber1, createNumber2, createNumber3, CustomNumber, deepEquals, shallowEquals } from "../basic";

describe('assignment 2 > basic : 값을 다루기', () => {
  describe('객체를 다뤄봅시다.', () => {
    it('값 비교', () => {
      expect(1 === 1).toBe(true);
      expect(1 === 2).toBe(false);
      expect(true === true).toBe(true);
      expect(false === false).toBe(true);
      expect("1" === "1").toBe(true);
      expect("1" == 1).toBe(true);
      expect("1" == true).toBe(true);
      expect("0" == false).toBe(true);
      expect(null == undefined).toBe(true);
      expect(null == false).toBe(false);
      expect(false == undefined).toBe(false);
      expect("1" === 1).toBe(false);
      expect("1" === true).toBe(false);
      expect("0" === false).toBe(false);
      expect(0 === false).toBe(false);
      expect(null === undefined).toBe(false);
      expect(null === false).toBe(false);
      expect(false === undefined).toBe(false);
      expect(false === undefined).toBe(false);
    })

    it('객체/배열/함수 비교', () => {
      expect({} === {}).toBe(false);
      expect([] === []).toBe(false);

      const a = {};
      const b = a;
      expect(a === b).toBe(true);

      const foo = { a, b: [], c: 1 };
      const bar = { a, b: [], c: 1, foo };
      const fn = () => null;
      const fn2 = () => null;
      const fn3 = fn;
      expect(foo === bar).toBe(false);
      expect(foo.a === bar.a).toBe(true);
      expect(foo.b === bar.b).toBe(false);
      expect(foo.c === bar.c).toBe(true);
      expect(foo === bar.foo).toBe(true);
      expect(fn === (() => null)).toBe(false);
      expect(fn2 === (() => null)).toBe(false);
      expect(fn === fn2).toBe(false);
      expect(fn === fn3).toBe(true);
      expect(fn.toString() === fn2.toString()).toBe(true);
      expect(fn.toString() === (() => null).toString()).toBe(true);
      expect((() => null).toString() === (() => null).toString()).toBe(true);
    })

    it.each([
      { target1: new Number(1), target2: new Number(1), expected: false },
      { target1: new String(1), target2: new String(1), expected: false },
      { target1: new class{}(), target2: new class{}(), expected: false },
      { target1: {}, target2: {}, expected: true },
      { target1: 1, target2: 1, expected: true },
      { target1: [], target2: [], expected: true },
      { target1: 'abc', target2: 'abc', expected: true },
      { target1: null, target2: null, expected: true },
      { target1: undefined, target2: undefined, expected: true },
      { target1: [1, 2, 3], target2: [1, 2, 3], expected: true },
      { target1: [1, 2, 3, [4]], target2: [1, 2, 3, [4]], expected: false },
      { target1: [1, 2, 3, { foo: 1 }], target2: [1, 2, 3, { foo: 1 }], expected: false },
      { target1: [1, 2], target2: [1, 2, 3], expected: false },
      { target1: { a: 1 }, target2: { a: 1 }, expected: true },
      { target1: { a: 1 }, target2: { a: 2 }, expected: false },
      { target1: { a: 1, b: { c: 2 } }, target2: { a: 1, b: { c: 2 } }, expected: false },
    ])('shallowEquals($target1, $target2) === $expected', ({ target1, target2, expected }) => {
      expect(shallowEquals(target1, target2)).toBe(expected);
    })

    it.each([
      { target1: new Number(1), target2: new Number(1), expected: false },
      { target1: new String(1), target2: new String(1), expected: false },
      { target1: new class{}(), target2: new class{}(), expected: false },
      { target1: {}, target2: {}, expected: true },
      { target1: 1, target2: 1, expected: true },
      { target1: [], target2: [], expected: true },
      { target1: 'abc', target2: 'abc', expected: true },
      { target1: null, target2: null, expected: true },
      { target1: undefined, target2: undefined, expected: true },
      { target1: [1, 2, 3], target2: [1, 2, 3], expected: true },
      { target1: [1, 2, 3, [4]], target2: [1, 2, 3, [4]], expected: true },
      { target1: [1, 2, 3, { foo: 1 }], target2: [1, 2, 3, { foo: 1 }], expected: true },
      { target1: [1, 2], target2: [1, 2, 3], expected: false },
      { target1: { a: 1 }, target2: { a: 1 }, expected: true },
      { target1: { a: 1 }, target2: { a: 2 }, expected: false },
      { target1: { a: 1, b: { c: 2, d: [], e: [1, 2, 3] } }, target2: { a: 1, b: { c: 2, d: [], e: [1, 2, 3] } }, expected: true },
      { target1: { a: 1, b: { c: 2, d: [], e: [1, 2, 3], f: new Number(1) } }, target2: { a: 1, b: { c: 2, d: [], e: [1, 2, 3], f: new Number(1) } }, expected: false },
    ])('deepEquals($target1, $target2) === $expected', ({ target1, target2, expected }) => {
      expect(deepEquals(target1, target2)).toBe(expected);
    })
  })

  describe('number를 다뤄봅시다.', () => {
    it('createNumber1 > ', () => {
      const num1 = createNumber1(1);
      const num2 = createNumber1(2);
      expect(num1 + num2).toBe(3);
      expect(1 + num2).toBe(3);
      expect(num1 + 2).toBe(3);
      expect(num1 === 1).toBe(false);
      expect(num1 === 2).toBe(false);
      expect(num1 == 1).toBe(true);
      expect(num2 == 2).toBe(true);
      expect(typeof num1 === 'number').toBe(false);
      expect(typeof num1 === 'object').toBe(true);
    })

    it('createNumber2 >', () => {
      const num1 = createNumber2(1);
      const num2 = createNumber2(2);
      expect(num1 + num2).toBe("12");
      expect(1 + num2).toBe("12");
      expect(num1 + 2).toBe("12");
      expect(num1 === "1").toBe(false);
      expect(num2 === "2").toBe(false);
      expect(num1 == "1").toBe(true);
      expect(num2 == "2").toBe(true);
      expect(typeof num1 === 'string').toBe(false);
      expect(typeof num1 === 'object').toBe(true);
      expect(num1 instanceof Number).toBe(false);
      expect(num2 instanceof Number).toBe(false);
    })

    it('createNumber3 > ', () => {
      const num1 = createNumber3(1);
      const num2 = createNumber3(2);
      expect(1 + num2).toBe(3);
      expect(num1 + 2).toBe(3);
      expect(num1 === 1).toBe(false);
      expect(num1 === 2).toBe(false);
      expect(num1 == 1).toBe(true);
      expect(num2 == 2).toBe(true);
      expect(JSON.stringify(num1)).toBe('"this is createNumber3 => 1"');
      expect(JSON.stringify(num2)).toBe('"this is createNumber3 => 2"');
      expect(JSON.stringify(num1 + num2)).toBe('3');
      expect(JSON.stringify(`${num1}${num2}`)).toBe('"12"');
      expect(typeof num1 === 'number').toBe(false);
      expect(typeof num1 === 'object').toBe(true);
      expect(num1 instanceof Number).toBe(false);
      expect(num2 instanceof Number).toBe(false);
    })

    it('createNumber3 > ', () => {
      const num1 = createNumber3(1);
      const num2 = createNumber3(2);
      expect(1 + num2).toBe(3);
      expect(num1 + 2).toBe(3);
      expect(num1 === 1).toBe(false);
      expect(num1 === 2).toBe(false);
      expect(num1 == 1).toBe(true);
      expect(num2 == 2).toBe(true);
      expect(JSON.stringify(num1)).toBe('"this is createNumber3 => 1"');
      expect(JSON.stringify(num2)).toBe('"this is createNumber3 => 2"');
      expect(JSON.stringify(num1 + num2)).toBe('3');
      expect(JSON.stringify(`${num1}${num2}`)).toBe('"12"');
      expect(typeof num1 === 'number').toBe(false);
      expect(typeof num1 === 'object').toBe(true);
      expect(num1 instanceof Number).toBe(false);
      expect(num2 instanceof Number).toBe(false);
    })

    it('CustomNumber > ', () => {
      const num1 = new CustomNumber(1);
      const num2 = new CustomNumber(2);
      const num3 = new CustomNumber(1);
      const num4 = new CustomNumber(2);
      expect(num1 === 1).toBe(false);
      expect(num2 === 2).toBe(false);
      expect(num3 === 1).toBe(false);
      expect(num4 === 2).toBe(false);
      expect(num1 == 1).toBe(true);
      expect(num2 == 2).toBe(true);
      expect(num3 == 1).toBe(true);
      expect(num4 == 2).toBe(true);
      expect(num1).toBe(num3);
      expect(num2).toBe(num4);
      expect(num1 + num2).toBe(3);
      expect(num3 + num4).toBe(3);
      expect(num1 + num3).toBe(2);
      expect(num2 + num4).toBe(4);
      expect(num3 + `${num4}`).toBe("12");
      expect(num1 + `${num2}`).toBe("12");
      expect(num1 + `${num3}`).toBe("11");
      expect(num2 + `${num4}`).toBe("22");
      expect(JSON.stringify(num3) + `${num4}`).toBe('"1"2');
      expect(JSON.stringify(num1) + `${num2}`).toBe('"1"2');
      expect(JSON.stringify(num1) + `${num3}`).toBe('"1"1');
      expect(JSON.stringify(num2) + `${num4}`).toBe('"2"2');
    })
  })
})
