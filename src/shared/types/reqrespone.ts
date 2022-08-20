type Maybe<T> = T | null;
type ReqResponse<T> = [Maybe<T>, Maybe<unknown>];

interface signinResponse {
  message: string;
  token: string;
  refreshToken: string;
  userId: string;
  name: string;
}

interface usersWordsResponse {
  id: string;
  difficulty: string;
  wordId: string;
  optional?: object; // TODO: need to describe
}

export { ReqResponse, signinResponse, usersWordsResponse };
