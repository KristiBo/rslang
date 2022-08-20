type Maybe<T> = T | null;
type ReqResponse<T> = [Maybe<T>, Maybe<unknown>];

type TUser = {
  name?: string,
  email: string,
  password?: string,
};

type TUserAuth = {
  id: string,
  email: string,
};

type TAuth = {
  message?: string,
  token: string,
  refreshToken?: string,
  userId: string,
  name?: string,
};

export {
  ReqResponse, TUser, TUserAuth, TAuth,
};
