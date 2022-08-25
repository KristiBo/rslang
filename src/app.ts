import { Word, TAuth } from './shared/types';
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
    this.initStartSprintListener();
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

  initStartSprintListener(): void {
    document.addEventListener('startSprint', (event: Event) => this.onStartSprint(event));
  }

  async onStartSprint(event: Event): Promise<void> {
    const startFrom = <{ runFrom: string }>(<CustomEvent>event).detail;
    console.log('startFrom: ', startFrom);
    const dict: Word[] = [];
    const _ = [0, 1, 2].map(async (i) => {
      const [words, error] = await this.model.api.getWords(0, i);
      if (error) console.log(error);
      if (words) dict.push(...words);
    });
    if (dict) {
      this.view.gamesPage.drawSprint(dict);
    }
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
      this.view.renderPage(hash, [], this.model.isRegisteredUser);
    }
  }

  initOnHashChange(): void {
    window.addEventListener('hashchange', () => this.onHashChange());
  }
}

export default App;
