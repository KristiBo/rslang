import { TAuth } from '../../shared/types';
import Api from '../../shared/api';

class Model {
  isRegisteredUser: boolean;

  api: Api;

  constructor() {
    this.isRegisteredUser = false;
    this.api = new Api();
  }

  setToLocalStorage(content: TAuth): void {
    this.isRegisteredUser = true;
    const time = new Date();
    localStorage.setItem('time', JSON.stringify(time));
    localStorage.setItem('token', JSON.stringify(content.token));
    localStorage.setItem('userId', JSON.stringify(content.userId));
    localStorage.setItem('refreshToken', JSON.stringify(content.refreshToken));
  }

  removeFromLocalStorage(): void {
    this.isRegisteredUser = false;
    localStorage.setItem('time', '');
    localStorage.setItem('token', '');
    localStorage.setItem('userId', '');
    localStorage.setItem('refreshToken', '');
  }
}

export default Model;
