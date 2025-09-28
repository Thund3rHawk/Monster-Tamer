export function exhaustiveGuard(_value: never) {
  throw Error(`Error: ${JSON.stringify(_value)}`);
}
