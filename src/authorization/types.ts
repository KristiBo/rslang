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

export { User, Auth, UserAuth };
