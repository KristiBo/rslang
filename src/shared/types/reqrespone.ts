import { Word } from './words';

type Maybe<T> = T | null;
type ReqResponse<T> = [Maybe<T>, Maybe<unknown>];

interface signinResponse {
  message: string;
  token: string;
  refreshToken: string;
  userId: string;
  name: string;
}

interface UsersWordData {
  difficulty: string;
  optional?: object; // TODO: need to describe
}

interface UsersWordsResponse extends UsersWordData {
  id: string;
  wordId: string;
}

interface PaginatedResults extends Word {
  _id: string;
  userWord?: UsersWordData;
}

interface UsersAggrWordsResponse {
  paginatedResults: PaginatedResults[];
  totalCount: { count: number };
}

export { ReqResponse, signinResponse, UsersWordsResponse, UsersAggrWordsResponse, UsersWordData };
