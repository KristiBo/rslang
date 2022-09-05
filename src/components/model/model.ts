import {
  GameStat,
  TAuth,
  DIFFICULTY,
  WINSNEEDED,
  Word,
  GAME,
  TUser,
  TxtBkReference,
  TxtBkWord,
  UsersWordsResponse,
  ReqResponse,
  UsersWordData,
} from '../../shared/types';
import Api from '../../shared/api';

class Model {
  private userState: boolean; // true for logged in

  private api: Api;

  constructor() {
    this.userState = false;
    this.api = new Api();
  }

  async userLogin(userData: TUser): Promise<[boolean, string]> {
    const { email, password } = userData;
    if (password) {
      if (userData.create) {
        // create before login
        const [_, error] = await this.api.createUser({ email, password });
        if (error) return [false, (<Error>error).message];
      }
      // login
      const [loginData, loginError] = await this.api.signin(email, password);
      if (loginError) return [false, (<Error>loginError).message];
      if (loginData) {
        this.setToLocalStorage(loginData);
        return [true, ''];
      }
    }
    return [false, 'Empty password'];
  }

  async setWordDifficulty(wordId: string, difficulty: DIFFICULTY): Promise<void> {
    const [dataGet, errorGet] = await this.api.getUsersWordById(wordId);
    if (difficulty !== DIFFICULTY.NONE) {
      // save to UW
      if (errorGet) console.log(errorGet);
      if (dataGet) {
        // update
        const [_, error] = await this.api.updateUsersWord(wordId, { difficulty });
        if (error) console.log(error);
      } else {
        // insert
        const [_, error] = await this.api.postUsersWord(wordId, { difficulty });
        if (error) console.log(error);
      }
    } else if (dataGet) {
      // delete from UW
      const [_, error] = await this.api.deleteUsersWord(wordId);
      if (error) console.log(error);
    }
  }

  async getWords(ref: TxtBkReference): Promise<ReqResponse<Array<TxtBkWord>>> {
    const { group, page } = ref;
    let result: TxtBkWord[] = [];
    let errorRes: unknown | null = null;
    if (group === 6) {
      const dashId = '_id';
      const filter = '{"userWord.difficulty":"hard"}';
      const wordsPerPage = '500';
      const [words, error] = await this.api.getUsrAggrWords({
        group: `${group}`, wordsPerPage, filter,
      });
      if (error) errorRes = error;
      if (words) {
        if (words?.[0].paginatedResults && words[0].paginatedResults.length > 0) {
          words[0].paginatedResults.forEach((item) => {
            const tempRes = item;
            tempRes.id = tempRes[dashId];
            let res: TxtBkWord = <TxtBkWord>tempRes;
            res.difficulty = tempRes.userWord ? tempRes.userWord.difficulty : DIFFICULTY.NONE;
            res.wins = 0;
            res.fails = 0;
            if (tempRes.userWord?.optional) {
              const entries = Object.values(tempRes.userWord.optional);
              res = entries.reduce((acc, elem): TxtBkWord => {
                acc.wins = elem.wins;
                acc.fails = elem.fails;
                return acc;
              }, res);
            }
            result.push(res);
          });
        }
      }
    } else {
      const [words, error] = await this.api.getWords(group, page);
      if (error) errorRes = error;
      if (words) {
        let [usrWords, usrError]: ReqResponse<UsersWordsResponse[]> = [[], null];
        if (this.userState) [usrWords, usrError] = await this.api.getUsersWords();
        if (usrError) errorRes = usrError;
        result = words.map((item) => {
          const userWord = usrWords?.find((dbItem) => dbItem.wordId === item.id);
          let res: TxtBkWord = <TxtBkWord>item;
          res.difficulty = userWord ? userWord.difficulty : DIFFICULTY.NONE;
          res.wins = 0;
          res.fails = 0;
          if (userWord?.optional) {
            const entries = Object.values(userWord.optional);
            res = entries.reduce((acc, elem): TxtBkWord => {
              acc.wins = elem.wins;
              acc.fails = elem.fails;
              return acc;
            }, res);
          }
          return res;
        });
      }
    }
    return [result, errorRes];
  }

  // group 1..6
  async getWordsForGame(game: GAME, group: number): Promise<Word[]> {
    const dict: Word[] = [];
    const dbGroup = group - 1; // Levels in DB starts from 0
    // generate shuffled array with random numbers from range [0..29]
    const pages = [...Array(30)].map((_, idx) => idx).sort(() => Math.random() - 0.5);
    pages.length = game === GAME.AUDIOCALL ? 1 : 3; // 1 page for audiocall, 3 for sprint
    const promises = (pages.map(async (i) => {
      const [words, error] = await this.api.getWords(dbGroup, i);
      if (error) console.log(error);
      if (words) dict.push(...words);
    }));
    await Promise.all(promises);
    return dict;
  }

  async getWordsFromTxtBk(game: GAME, grp: number, pg: number): Promise<Word[]> {
    const group = `${grp - 1}`;
    const page = `${pg - 1}`;
    const dashId = '_id';
    let filter = `{"$and":[{"userWord.difficulty":{"$ne":"learn"}},{"page": ${page}}]}`;
    const dict: Word[] = [];
    let wordsPerPage = '20';
    const wordsNeeded = game === GAME.SPRINT ? 60 : 20;
    const [words, error] = await this.api.getUsrAggrWords({
      group, wordsPerPage, filter,
    });
    if (error) console.log(error);
    if (words?.[0].paginatedResults && words[0].paginatedResults.length > 0) {
      words[0].paginatedResults.forEach((item) => {
        const result = item;
        result.id = result[dashId];
        dict.push(result);
      });
    }
    if (dict.length < wordsNeeded && page) {
      wordsPerPage = `${wordsNeeded - dict.length}`;
      filter = `{"$and":[{"userWord.difficulty":{"$ne":"learn"}},{"page":{"$lt": ${page}}}]}`;
      const [moreWords, moreError] = await this.api.getUsrAggrWords({
        group, wordsPerPage, filter,
      });
      if (moreError) console.log(error);
      if (moreWords?.[0].paginatedResults && moreWords[0].paginatedResults.length > 0) {
        moreWords[0].paginatedResults.forEach((item) => {
          const result = item;
          result.id = result[dashId];
          dict.push(result);
        });
      }
    }
    return dict;
  }

  async saveStatFromGame(stat: GameStat): Promise<void> {
    const [words, error] = await this.api.getUsersWords();
    const newUWOptData = { wins: 0, fails: 0, count: 0 };
    if (error) throw new Error('Error occured while getting users words');
    const promises = stat.words.map(async (item) => {
      const userWord = words?.find((dbItem) => dbItem.wordId === item.id);
      if (userWord) {
        // update
        const { difficulty, optional } = userWord;
        const result: UsersWordData = { difficulty, optional };
        if (result.optional && !result.optional[stat.game]) {
          result.optional[stat.game] = newUWOptData;
        }
        if (result.optional && result.optional[stat.game]) {
          if (item.answer) {
            result.optional[stat.game].wins += 1;
            result.optional[stat.game].count += 1;
          } else {
            result.optional[stat.game].fails += 1;
            result.optional[stat.game].count = 0;
            if (result.difficulty === DIFFICULTY.LEARN) result.difficulty = DIFFICULTY.NONE;
          }
          const limit = (
            result.difficulty === DIFFICULTY.NEW || result.difficulty === DIFFICULTY.NONE
          )
            ? WINSNEEDED.NEW
            : WINSNEEDED.HARD;
          if (result.optional[stat.game].count >= limit) {
            result.difficulty = DIFFICULTY.LEARN;
          }
          const [_, errorPut] = await this.api.updateUsersWord(item.id, result);
          if (errorPut) console.log(errorPut);
        }
      } else {
        // insert
        newUWOptData.count = 1;
        if (item.answer) {
          newUWOptData.wins = 1;
        } else {
          newUWOptData.fails = 1;
        }
        const [_, errorPost] = await this.api.postUsersWord(item.id, {
          difficulty: DIFFICULTY.NEW,
          optional: { [stat.game]: newUWOptData },
        });
        if (errorPost) console.log(errorPost);
      }
    });
    await Promise.all(promises);
  }

  private setToLocalStorage(content: TAuth): void {
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
