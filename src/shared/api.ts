import URL from './constants';
import {
  Word, ReqResponse, ReqData, signinResponse, usersWordsResponse,
} from './types/index';

class Api {
  token = '';

  // common request
  // req: ReqData - {url: str, method: 'GET' etc, auth?: bool, body?: str}
  // T: type of result
  // return: [T, null] | [null, Error]
  async request<T>(req: ReqData): Promise<ReqResponse<T>> {
    const headers: HeadersInit = { Accept: 'application/json' };
    if (req.auth) headers.Authorization = `Bearer ${this.token}`;
    if (req.body) headers['Content-Type'] = 'application/json';
    const { method } = req;
    const options: RequestInit = { headers, method };
    if (req.body) options.body = req.body;
    try {
      const response = await fetch(req.url, options);
      if (response.ok) {
        const data = await response.json();
        return [data, null];
      }
      throw (new Error(`(${response.status}) ${response.statusText}`));
    } catch (error: unknown) {
      return [null, error];
    }
  }

  // get word list
  // group: 0..5 -- difficulty group
  // page: 0..29 -- 30 pages in each group
  // return: [Word[20], null] | [null, Error]
  async getWords(group = 0, page = 0): Promise<ReqResponse<Array<Word>>> {
    const url = `${URL}words?page=${page}&group=${group}`;
    const method = 'GET';
    const result = await this.request<Array<Word>>({ url, method });
    return result;
  }

  // get word by id
  // id: word's id like '5e9f5ee35eb9e72bc21af4a0'
  // return: [Word, null] | [null, Error]
  async getWord(id: string): Promise<ReqResponse<Word>> {
    const url = `${URL}words/${id}`;
    const method = 'GET';
    const result = await this.request<Word>({ url, method });
    return result;
  }

  // get word by id
  // id: user's id like '62ffed00299cea0016064168'
  // return: [Word[], null] | [null, Error]
  async getUsersWords(id: string): Promise<ReqResponse<Array<Word>>> {
    const url = `${URL}users/${id}/words`;
    const method = 'GET';
    const auth = true;
    const result = await this.request<Array<Word>>({ url, method, auth });
    return result;
  }

  // add word to user's list
  // id: user's id like '62ffed00299cea0016064168'
  // wordId: word's id like '5e9f5ee35eb9e72bc21af4a0'
  // difficulty: word's difficulty like 'hard', 'weak' etc
  // optional: object with additional caustom data // TODO: need to describe
  // return: [Word[], null] | [null, Error]
  // Errors:
  // 400 - Bad request
  // 401 - Access token is missing or invalid
  // 417 - such user word already exists
  async postUsersWord(id: string, wordId: string, difficulty = 'hard', optional: object = {}): Promise<ReqResponse<string>> {
    const url = `${URL}users/${id}/words/${wordId}`;
    const method = 'POST';
    const auth = true;
    const body = JSON.stringify({ difficulty, optional });
    const result = await this.request<string>({
      url, method, auth, body,
    });
    return result;
  }

  // get word's data from user's list
  // id: user's id like '62ffed00299cea0016064168'
  // wordId: word's id like '5e9f5ee35eb9e72bc21af4a0'
  // return:
  // return: [usersWordsResponse, null] | [null, Error]
  async getUsersWordById(id: string, wordId: string): Promise<ReqResponse<usersWordsResponse>> {
    const url = `${URL}users/${id}/words/${wordId}`;
    const method = 'GET';
    const auth = true;
    const result = await this.request<usersWordsResponse>({
      url, method, auth,
    });
    return result;
  }

  // update word in user's list
  // id: user's id like '62ffed00299cea0016064168'
  // wordId: word's id like '5e9f5ee35eb9e72bc21af4a0'
  // difficulty: word's difficulty like 'hard', 'weak' etc
  // optional: object with additional caustom data // TODO: need to describe
  // return: [usersWordsResponse, null] | [null, Error]
  // Errors:
  // 400 - Bad request
  // 401 - Access token is missing or invalid
  async updateUsersWord(id: string, wordId: string, difficulty = 'hard', optional: object = {}): Promise<ReqResponse<usersWordsResponse>> {
    const url = `${URL}users/${id}/words/${wordId}`;
    const method = 'PUT';
    const auth = true;
    const body = JSON.stringify({ difficulty, optional });
    const result = await this.request<usersWordsResponse>({
      url, method, auth, body,
    });
    return result;
  }

  // add word to user's list
  // id: user's id like '62ffed00299cea0016064168'
  // wordId: word's id like '5e9f5ee35eb9e72bc21af4a0'
  // return: [Word[], null] | [null, Error]
  // Errors:
  // 401 - Access token is missing or invalid
  async deleteUsersWord(id: string, wordId: string): Promise<ReqResponse<string>> {
    const url = `${URL}users/${id}/words/${wordId}`;
    const method = 'DELETE';
    const auth = true;
    const result = await this.request<string>({
      url, method, auth,
    });
    return result;
  }

  // sign in
  // email, password: string
  // return: [signinResponse, null] | [null, Error]
  async signin(email: string, password: string): Promise<ReqResponse<signinResponse>> {
    const url = `${URL}signin`;
    const method = 'POST';
    const body = JSON.stringify({ email, password });
    const result = await this.request<signinResponse>({ url, method, body });
    return result;
  }

  // this.token setter
  setToken(token: string): void {
    this.token = token;
  }
}

export default Api;
