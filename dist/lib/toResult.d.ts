export type Result<E, T> = [E] | [undefined, T];
export type PromiseResult<E, T> = Promise<Result<E, T>>;
export default function toResult<E extends Error, T>(p: Promise<T>): PromiseResult<E, T>;
