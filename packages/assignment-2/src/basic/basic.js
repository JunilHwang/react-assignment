export function shallowEquals(target1, target2) {
  if (target1 === target2) {
    return true;
  }
  if (Array.isArray(target1) && Array.isArray(target2) && target1.length === target2.length) {
    return target1.every((v, k) => v === target2[k]);
  }
  if (target1.constructor === Object && target2.constructor === Object) {
    const key1 = Object.keys(target1);
    const key2 = Object.keys(target2);
    return target1 === target2 || key1.length === key2.length && key1.every(key => target1[key] === target2[key]);
  }
  return false;
}

export function deepEquals(target1, target2) {
  if (target1 === target2) {
    return true;
  }
  if (Array.isArray(target1) && Array.isArray(target2) && target1.length === target2.length) {
    return target1.every((v, k) => deepEquals(v, target2[k]));
  }
  if (target1.constructor === Object && target2.constructor === Object) {
    const key1 = Object.keys(target1);
    const key2 = Object.keys(target2);
    return target1 === target2 || key1.length === key2.length && key1.every(key => deepEquals(target1[key], target2[key]));
  }
  return false;
}


export function createNumber1(n) {
  return new Number(n);
}

export function createNumber2(n) {
  return {
    toString() { return String(n) }
  }
}

export function createNumber3(n) {
  return {
    toString() { return String(n) },
    valueOf() { return n },
    toJSON() { return `this is createNumber3 => ${n}` },
  }
}

export class CustomNumber {
  static VALUES = {};
  #value;
  constructor(value) {
    if (CustomNumber.VALUES[value]) {
      return CustomNumber.VALUES[value];
    }
    this.#value = value;
    CustomNumber.VALUES[value] = this;
  }

  valueOf() {
    return this.#value.valueOf();
  }

  toString() {
    return this.#value.toString();
  }

  toJSON() {
    return this.#value.toString();
  }
}
