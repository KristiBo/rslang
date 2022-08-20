import URL from './constants';
import { showErrMessage } from '../components/auth/authHelpers';
import {
  Word, ReqResponse, TUser, TAuth, TUserAuth,
} from './types/index';

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

  async getUser(user: TAuth): Promise<TUserAuth> {
    try {
      const { userId, token } = user;
      const rawResponse = await fetch(`${URL}users/${userId}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const content = await rawResponse.json();
      return content;
    } catch (err) {
      showErrMessage('Error: User not found');
      throw new Error(`Error: ${err}`);
    }
  }

  async createUser(user: TUser): Promise<TUserAuth | undefined> {
    try {
      const rawResponse = await fetch(`${URL}users`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });
      const content = await rawResponse.json();
      console.log('createUser', content);
      return content;
    } catch (err: unknown) {
      showErrMessage('Error: User already exist');
      throw new Error(`Error: ${err}`);
    }
  }

  async loginUser(user: TUser): Promise<TAuth> {
    try {
      const rawResponse = await fetch(`${URL}signin`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });
      const content = await rawResponse.json();
      console.log('loginUser', content);
      return content;
    } catch (err) {
      showErrMessage('Error: Incorrect email or password');
      throw new Error(`${err}`);
    }
  }
}

export default Api;
