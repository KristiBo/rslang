import { GameStat, TAuth, DIFFICULTY, WINSNEEDED, UsersWordData, UWOptional } from '../../shared/types';
import Api from '../../shared/api';

class Model {
  private userState: boolean;

  api: Api;

  constructor() {
    this.userState = false;
    this.api = new Api();
  }

  async setWordDifficulty(wordId: string, difficulty: DIFFICULTY): Promise<void> {
    const [dataGet, errorGet] = await this.api.getUsersWordById(wordId);
    if (difficulty !== DIFFICULTY.NONE) {
      // save to UW
      if (errorGet) console.log(errorGet);
      if (dataGet) {
        // update 
        const [_, errorPut] = await this.api.updateUsersWord(wordId, { difficulty });
        if (errorPut) console.log(errorPut);
      } else {
        // insert
        const [dataPost, errorPost] = await this.api.postUsersWord(wordId, { difficulty });
      }
    } else if (dataGet) {
      // delete from UW
      const [_, errorPost] = await this.api.deleteUsersWord(wordId);
      if (errorPost) console.log(errorPost);
    }
  }

  async saveStatFromGame(stat: GameStat): Promise<void> {
    const [words, error] = await this.api.getUsersWords();
    if (error) throw new Error('Error occured while getting users words');
    const promises = stat.words.map(async (item) => {
      const userWord = words?.find((dbItem) => dbItem.wordId === item.id);
      if (userWord) {
        // update 
        const timesPlayed = userWord.optional?.[stat.game] ?? 0;
        const { difficulty } = userWord;
        let optional: UWOptional;
        // good answer
        // if (item.answer && difficulty !== DIFFICULTY.LEARN) {
        //   if (userWord.optional && userWord.optional[stat.game]) {
        //     optional = userWord.optional;
        //     if (!optional?.[stat.game]) optional[stat.game] = 0;
        //   } else {
        //     optional = { [stat.game]: 0 };
        //   }
        //   const limit = (difficulty === DIFFICULTY.NEW) ? WINSNEEDED.NEW : WINSNEEDED.HARD;
        //   if (timesPlayed < limit) {
        //     result.optional[stat.game]! += 1;
        //   } else {
        //     result.difficulty = DIFFICULTY.LEARN;
        //     delete result.optional;
        //   }
        // }
        // if (!item.answer && difficulty === DIFFICULTY.LEARN) {
        //   result.difficulty = DIFFICULTY.NONE;
        // }
        // const [_, errorPut] = await this.api.updateUsersWord(item.id, result);
        // if (errorPut) console.log(errorPut);
      } else {
        // insert
        const [dataPost, errorPost] = await this.api.postUsersWord(item.id, {
          difficulty: DIFFICULTY.NEW,
          optional: { [stat.game]: 1 },
        });
      }
    });
    await Promise.all(promises);
  }

  setToLocalStorage(content: TAuth): void {
    this.userState = true;
    const time = new Date();
    localStorage.setItem('time', JSON.stringify(time));
    localStorage.setItem('token', JSON.stringify(content.token));
    localStorage.setItem('userId', JSON.stringify(content.userId));
    localStorage.setItem('refreshToken', JSON.stringify(content.refreshToken));
  }

  removeFromLocalStorage(): void {
    this.userState = false;
    localStorage.setItem('time', '');
    localStorage.setItem('token', '');
    localStorage.setItem('userId', '');
    localStorage.setItem('refreshToken', '');
  }

  get isRegisteredUser(): boolean {
    return this.userState;
  }

  set isRegisteredUser(value: boolean) {
    // no action
  }
}

export default Model;
