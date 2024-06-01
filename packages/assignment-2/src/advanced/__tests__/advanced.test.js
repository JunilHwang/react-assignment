import { describe } from "vitest";
import { memo1, memo2 } from "../advanced.js";

describe('assignment 2 > advanced : 값을 캐시하기', () => {
  it('memo1 > ', () => {
    let a = 1000000;
    const fn = () => Array.from({ length: a }).map((_, k) => k + 1);
    expect(fn() === fn()).toBe(false);
    expect(memo1(fn) === memo1(fn)).toBe(true);
    a = 1;
    expect(fn().length).toBe(1);
    expect(memo1(fn).length).toBe(1000000);
  })

  it('memo2 > ', () => {
    let a = 100;
    let b = 100;
    const fn = () => Array.from({ length: a * b }).map((_, k) => k + 1);
    expect(fn() === fn()).toBe(false);
    expect(memo2(fn, [a]) === memo2(fn, [a])).toBe(true);
    a = 1;
    expect(fn().length).toBe(100);
    expect(memo2(fn, [a]).length).toBe(100);
    b = 1;
    expect(fn().length).toBe(1);
    expect(memo2(fn, [a]).length).toBe(100);
  })
})
