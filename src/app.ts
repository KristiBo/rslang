import {
  Word, TAuth, SprintWord, PAGE, TxtBkReference,
} from './shared/types';
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
    this.initGameStatListener();
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
    document.addEventListener('startSprint', (event: Event) => this.onRunSprintFromTxtBk(event));
  }

  initGameStatListener(): void {
    document.addEventListener('gameStatistic', (event: Event) => this.onGameStat(event));
  }

  async onGameStat(event: Event): Promise<void> {
    const { game, words } = <{ game: string, words: SprintWord[] }>(<CustomEvent>event).detail;
    console.log('GameStat from: ', game);
    console.log('GameStat words: ', words);
  }

  // TxtBkReference = { group: 0..6, page: 0..29 }
  async onRunSprintFromTxtBk(event: Event): Promise<void> {
    const { group, page } = <TxtBkReference>(<CustomEvent>event).detail;
    const dict: Word[] = [];
    let pages: number[] = [];
    if (group === 6) {
      // TODO: get words for group 6: difficulty words
    } else if (page < 3) {
      pages = [0, 1, 2];
      pages.length = page + 1;
    } else {
      // 2 random previous pages + current page
      pages = [...Array(page)].map((_, idx) => idx).sort(() => Math.random() - 0.5);
      pages.length = 2;
      pages.push(page);
    }
    // get words for pages
    const promises = (pages.map(async (i) => {
      const [words, error] = await this.model.api.getWords(group, i);
      if (error) console.log(error);
      if (words) dict.push(...words);
    }));
    await Promise.all(promises);
    if (dict) {
      this.view.renderPage(PAGE.PLAYSPRINT, dict);
    }
  }

  async runSprintFromGames(level: number): Promise<void> {
    if (level > 0 && level < 7 && +level.toFixed(0) === level) {
      const dict: Word[] = [];
      const dbLevel = level - 1; // Levels in DB starts from 0
      // generate array with 3 random numbers from range [0..29]
      const trio = [...Array(30)].map((_, idx) => idx).sort(() => Math.random() - 0.5);
      trio.length = 3;
      const promises = (trio.map(async (i) => {
        const [words, error] = await this.model.api.getWords(dbLevel, i);
        if (error) console.log(error);
        if (words) dict.push(...words);
      }));
      await Promise.all(promises);
      if (dict) {
        this.view.renderPage(PAGE.PLAYSPRINT, dict);
      }
    } else {
      window.location.hash = 'error';
      // throw new Error(`Get wrong level number while starting Sprint game: ${level}`);
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
    console.log(authData);
  }

  async onHashChange(): Promise<void> {
    const hash = window.location.hash.substring(2);
    const hashPart = hash.substring(0, hash.length - 2);
    if (hash === PAGE.TEXTBOOK) {
      const [words, error] = await this.model.api.getWords();
      if (error) console.log(error); // TODO: remake it
      if (words) {
        this.view.renderPage(hash, words, this.model.isRegisteredUser);
        this.view.pagination.addListenersToBtns(() => this.changeWords());
        this.addListenersToCards();
      }
    } else if (hashPart === PAGE.GAMESPRINT || hashPart === PAGE.GAMEAUDIOCALL) {
      this.runSprintFromGames(Number(hash.slice(-1)));
    } else {
      // TODO: prepare some data if needed for page
      this.view.renderPage(hash, [], this.model.isRegisteredUser);
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
    console.log([words]);
    if (words) {
      const cards = document.querySelector('.textbook__cards') as HTMLButtonElement;
      cards.innerHTML = '';
      this.view.textbookPage.drawCards(words, this.model.isRegisteredUser);
      console.log(this.model.isRegisteredUser);
      this.view.pagination.changeBcgColor();
      this.addListenersToCards();
    }
  }

  addListenersToCards(): void {
    const cards = document.querySelectorAll('.card');
    cards.forEach((card) => card.addEventListener('click', (e) => {
      if (((e.target) as HTMLElement).closest('.btn-difficult')) {
        this.model.api.postUsersWord(card.id, { difficulty: 'hard' });
        console.log('difficult');
      }
      if (((e.target) as HTMLElement).closest('.btn-studied')) {
        console.log('studied');
      }
    }));
  }
}

export default App;
