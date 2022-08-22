type Maybe<T> = T | null;
type ReqResponse<T> = [Maybe<T>, Maybe<unknown>];

export { Maybe, ReqResponse };
