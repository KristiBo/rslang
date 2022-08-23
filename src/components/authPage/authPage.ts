import Auth from '../auth/auth';
import Modal from '../modal/modal';

class AuthPage {
  modal: Modal | undefined;

  create(): void {
    this.modal = new Modal();
    const auth = new Auth();
    this.modal.content.elem.innerHTML = auth.renderAuthPage();
    auth.addListeners();
  }
}

export default AuthPage;
