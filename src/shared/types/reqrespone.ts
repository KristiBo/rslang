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

interface Statistics {
  learnedWords: number;
  optional?: object; // TODO: need to describe
}

interface Settings {
  wordsPerDay: number;
  optional?: object; // TODO: need to describe
}

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
  ReqResponse,
  signinResponse,
  UsersWordsResponse,
  UsersAggrWordsResponse,
  UsersWordData,
  Statistics,
  Settings,
  TUser,
  TUserAuth,
  TAuth,
};
