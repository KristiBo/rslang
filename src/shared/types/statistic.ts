import { GameKeys } from './reqrespone';
import { SprintWord } from './words';

interface GameStat {
  game: GameKeys;
  words: SprintWord[];
  succession: number;
}

interface Statistic {
  learnedWords: number;
  optional: {
    [key: string]: {
      t: number,
      s: number[],
      a: number[],
    }
  };
}

export { GameStat, Statistic };
