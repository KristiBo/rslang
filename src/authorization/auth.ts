import { User, Auth, UserAuth } from './types';

const url = 'https://rslback.herokuapp.com';

const getUser = async (user: Auth): Promise<UserAuth> => {
  try {
    const { userId, token } = user;
    const rawResponse = await fetch(`${url}/users/${userId}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const content = await rawResponse.json();
    return content;
  } catch (err) {
    const errMsg = document.getElementById('form__error') as HTMLElement;
    errMsg.innerText = 'Error: User not found';
    errMsg.style.display = 'block';
    throw new Error(`Error: ${err}`);
  }
};

const createUser = async (user: User): Promise<UserAuth | undefined> => {
  try {
    const rawResponse = await fetch(`${url}/users`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });
    const content = await rawResponse.json();
    return content;
  } catch (err: unknown) {
    const errMsg = document.getElementById('form__error') as HTMLElement;
    errMsg.innerText = 'Error: User already exist';
    errMsg.style.display = 'block';
    throw new Error(`Error: ${err}`);
  }
};

const loginUser = async (user: User): Promise<Auth> => {
  try {
    const rawResponse = await fetch(`${url}/signin`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });
    const content = await rawResponse.json();
    return content;
  } catch (err) {
    const errMsg = document.getElementById('form__error') as HTMLElement;
    errMsg.innerText = 'Error: Incorrect email or password';
    errMsg.style.display = 'block';
    throw new Error(`${err}`);
  }
};

export { createUser, loginUser, getUser };
