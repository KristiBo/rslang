type Maybe<T> = T | null;
type ReqResponse<T> = [Maybe<T>, Maybe<unknown>];

type User = {
  name?: string,
  email: string,
  password?: string,
};

type UserAuth = {
  id: string,
  email: string,
};

type Auth = {
  message?: string,
  token: string,
  refreshToken?: string,
  userId: string,
  name?: string,
};

export {
  ReqResponse, User, UserAuth, Auth,
};
