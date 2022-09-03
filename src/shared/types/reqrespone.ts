import { Word } from './words';
import { Maybe } from './common';
import { GAME, DIFFICULTY } from './enums';

type ReqResponse<T> = [Maybe<T>, Maybe<unknown>];

interface signinResponse {
  message: string;
  token: string;
  refreshToken: string;
  userId: string;
  name: string;
}

type GameKeys = keyof typeof GAME; // 'sprint' | 'audiocall';

type UWOptional = { [key: string]: number };

interface UsersWordData {
  difficulty: DIFFICULTY;
  optional?: UWOptional;
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
  UWOptional,
  GameKeys,
};
