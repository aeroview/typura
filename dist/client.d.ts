export type ClientOptions = {
    endpoint: string;
    fetchOptions?: Omit<RequestInit, 'method' | 'body'>;
    onError?: (error: any) => void;
};
export declare class Non200Response<T> extends Error {
    status: number;
    response: T;
    constructor(status: number, response: T);
}
/**
 * We're purposely not putting any type alias for the client route to aid in better IDE intellisense.
 * Otherwise, the TS compiler/autocomplete might suggest the type alias instead of the underlying (initial) type.
*/
export declare function client<A extends {
    name: string;
    input: any;
    output: any;
}, ErrorResponseType = {}>(name: A['name'], input: A['input'], options?: ClientOptions): Promise<A['output']>;
