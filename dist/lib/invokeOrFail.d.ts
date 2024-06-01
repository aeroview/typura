export type Result<E, T> = [E] | [undefined, T];
export declare function invokeOrFail<E extends Error, T>(executable: () => T): Result<E, T>;
