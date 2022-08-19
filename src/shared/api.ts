import URL from './constants';
import { Word, ReqResponse } from './types/index';

class Api {
  // get word list
  // group: 0..5 -- difficulty group
  // page: 0..29 -- 30 pages in each group
  // return: [Word[20], null] | [null, Error]
  async getWords(group = 0, page = 0): Promise<ReqResponse<Array<Word>>> {
    try {
      const rawResponse = await fetch(`${URL}words?page=${page}&group=${group}`);
      const data = await rawResponse.json();
      return [data, null];
    } catch (error: unknown) {
      return [null, error];
    }
  }

  // get word by id
  // id: word's id like '5e9f5ee35eb9e72bc21af4a0'
  // return: [Word, null] | [null, Error]
  async getWord(id: string): Promise<ReqResponse<Word>> {
    try {
      const rawResponse = await fetch(`${URL}words/${id}`);
      const data = await rawResponse.json();
      return [data, null];
    } catch (error: unknown) {
      return [null, error];
    }
  }
}

export default Api;
