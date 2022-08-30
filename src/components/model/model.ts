import { TAuth } from '../../shared/types';
import Api from '../../shared/api';

class Model {
  private userState: boolean;

  api: Api;

  constructor() {
    this.userState = false;
    this.api = new Api();
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
