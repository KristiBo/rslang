import { TAuth } from './shared/types';
import AppView from './components/appView/appView';
import Model from './components/model/model';
import { englishLevels } from './shared/constants';

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
        this.addListenersToBtns();
      }
    } else {
      // TODO: prepare some data if needed for page
      this.view.renderPage(hash);
    }
  }

  initOnHashChange(): void {
    window.addEventListener('hashchange', () => this.onHashChange());
  }

  async changeWords(): Promise<void> {
    const [words] = await this.model.api.getWords(
      this.view.pagination.groupNr,
      this.view.pagination.getPageNr(),
    );
    if (words) {
      const cards = document.querySelector('.textbook__cards') as HTMLButtonElement;
      cards.innerHTML = '';
      this.view.textbookPage.drawCards(words, this.model.isRegisteredUser);
      this.view.pagination.changeBcgColor();
    }
  }

  addListenersToBtns(): void {
    const btnStart = document.querySelector('.button_start') as HTMLButtonElement;
    const btnPrev = document.querySelector('.button_prev') as HTMLButtonElement;
    const btnNext = document.querySelector('.button_next') as HTMLButtonElement;
    const btnEnd = document.querySelector('.button_end') as HTMLButtonElement;
    const levelBtns = document.querySelectorAll('.button_level');
    levelBtns.forEach((el) => {
      el.addEventListener('click', () => {
        this.view.pagination.groupNr = englishLevels.indexOf(el.innerHTML);
        this.changeWords();
        levelBtns.forEach((elem) => elem.classList.remove('active'));
        el.classList.add('active');
      });
    });
    btnNext.addEventListener('click', () => {
      this.view.pagination.goToNextPage();
      this.changeWords();
    });
    btnPrev.addEventListener('click', () => {
      this.view.pagination.goToPrevPage();
      this.changeWords();
    });
    btnEnd.addEventListener('click', () => {
      this.view.pagination.goToLastPage();
      this.changeWords();
    });
    btnStart.addEventListener('click', () => {
      this.view.pagination.goToFirstPage();
      this.changeWords();
    });
  }
}

export default App;
