import { TAuth } from './shared/types';
import AppView from './components/appView/appView';
import Model from './components/model/model';

class App {
  model: Model;

  view: AppView;

  constructor() {
    this.model = new Model();
    this.view = new AppView();
  }

  start(): void {
    this.view.create();
    this.view.header.addListeners(() => this.showAuth());
    this.initOnHashChange();
    this.initLoginListener();
  }

  // show auth form
  showAuth(): void {
    const linkAuth = <HTMLAnchorElement>document.querySelector('.nav__link_auth');
    if (linkAuth && this.model.isRegisteredUser) {
      linkAuth.classList.remove('logged-in');
      linkAuth.textContent = 'Войти';
      this.model.removeFromLocalStorage();
    } else {
      this.view.authPage.create();
    }
  }

  initLoginListener(): void {
    document.addEventListener('userLogin', (event: Event) => this.onUserLogged(event));
  }

  onUserLogged(event: Event): void {
    const authData = <TAuth>(<CustomEvent>event).detail;
    this.view.authPage.modal?.destroy();
    this.model.setToLocalStorage(authData);
    const linkAuth = <HTMLAnchorElement>document.querySelector('.nav__link_auth');
    if (linkAuth) {
      linkAuth.classList.add('logged-in');
      linkAuth.textContent = 'Выйти';
    }
  }

  async onHashChange(): Promise<void> {
    const hash = window.location.hash.substring(2);
    if (hash === 'textbook') {
      const [words, error] = await this.model.api.getWords();

      if (error) console.log(error); // TODO: remake it
      if (words) {
        this.view.renderPage(hash, words, this.model.isRegisteredUser);
      }
    } else {
      // TODO: prepare some data if needed for page
      this.view.renderPage(hash);
    }
  }

  initOnHashChange(): void {
    window.addEventListener('hashchange', () => this.onHashChange());
  }
}

export default App;
