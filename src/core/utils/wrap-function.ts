export function wrapFunction<A extends any[], R>(
  fn: (...args: A) => R,
  callback: (...args: A) => any
): (...args: A) => R {
  return function (this: any, ...args: A): R {
    callback(...args);
    return fn.apply(this, args);
  };
}
