import { GameKeys } from './reqrespone';
import { SprintWord } from './words';

interface GameStat {
  game: GameKeys;
  words: SprintWord[];
  succession: number;
}

interface StatQueue {
  wordId: string;
  difficulty: string;
}

export { GameStat, StatQueue };
