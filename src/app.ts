import {
  Word, PAGE, TxtBkReference, GameStat, GAME, TUser,
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
      // logout
      linkAuth.classList.remove('logged-in');
      linkAuth.textContent = 'Войти';
      this.model.removeFromLocalStorage();
      this.onHashChange(); // page refresh
    } else {
      this.view.authPage.create();
    }
  }

  initLoginListener(): void {
    document.addEventListener('userLogin', (event: Event) => this.onUserLogin(event));
  }

  initStartSprintListener(): void {
    document.addEventListener('startSprint', (event: Event) => this.onRunSprintFromTxtBk(event));
  }

  initGameStatListener(): void {
    document.addEventListener('gameStatistic', (event: Event) => this.onGameStat(event));
  }

  async onGameStat(event: Event): Promise<void> {
    const statistic = <GameStat>(<CustomEvent>event).detail;
    console.log('GameStat from: ', statistic.game);
    console.log('GameStat words: ', statistic.words);
    console.log('GameStat succession: ', statistic.succession);
    if (this.model.isRegisteredUser) this.model.saveStatFromGame(statistic);
  }

  // TxtBkReference = { group: 0..6, page: 0..29 }
  async onRunSprintFromTxtBk(event: Event): Promise<void> {
    const { group, page } = <TxtBkReference>(<CustomEvent>event).detail;
    const dict: Word[] = [];
    let pages: number[] = [];
    if (group === 6) {
      // TODO: get words for group 6: difficulty words
    } else if (page < 3) {
      pages = [0, 1, 2]; // first 3 pages
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

  // TODO: need to make it
  async runGameFromTxtBk(game: GAME, group: number, page: number): Promise<void> {
    if (group > 0 && group < 7 && +group.toFixed(0) === group) {
      const dict = await this.model.getWordsFromTxtBk(game, group, page);
      const pageId = game === GAME.SPRINT ? PAGE.PLAYSPRINT : PAGE.PLAYAUDIOCALL;
      if (dict) this.view.renderPage(pageId, dict);
    } else {
      window.location.hash = 'error';
    }
  }

  async runGameFromGames(game: GAME, group: number): Promise<void> {
    if (group > 0 && group < 7 && +group.toFixed(0) === group) {
      const dict = await this.model.getWordsForGame(game, group);
      const page = game === GAME.SPRINT ? PAGE.PLAYSPRINT : PAGE.PLAYAUDIOCALL;
      if (dict) this.view.renderPage(page, dict);
    } else {
      window.location.hash = 'error';
      // throw new Error(`Get wrong level number while starting Sprint game: ${level}`);
    }
  }

  async onUserLogin(event: Event): Promise<void> {
    const userData = <TUser>(<CustomEvent>event).detail;
    const [result, error] = await this.model.userLogin(userData);
    if (error) {
      this.view.authPage.showErrorMsg(error);
    }
    if (result) {
      this.view.authPage.closeModal();
      // this.model.setToLocalStorage(authData);
      const linkAuth = <HTMLAnchorElement>document.querySelector('.nav__link_auth');
      if (linkAuth) {
        linkAuth.classList.add('logged-in');
        linkAuth.textContent = 'Выйти';
        this.onHashChange();
      }
    }
  }

  async onHashChange(): Promise<void> {
    const hash = window.location.hash.substring(2);
    const hashParts = hash.split('/');
    if (hashParts[0] === PAGE.TEXTBOOK) {
      // textbook
      let group = +(hashParts[1] ?? 0);
      if (group) group -= 1;
      let page = +(hashParts[2] ?? 0);
      if (page) page -= 1;
      const [words, error] = await this.model.getWords({ group, page });
      if (error) console.log(error); // TODO: remake it
      if (words) {
        this.view.renderPage(PAGE.TEXTBOOK, words, this.model.isRegisteredUser, group, page);
      }
    } else if (hashParts.length === 4 && hashParts[1] === GAME.SPRINT) {
      // run sprint
      this.runGameFromTxtBk(GAME.SPRINT, Number(hashParts[2]), Number(hashParts[3]));
    } else if (hashParts.length === 3 && hashParts[1] === GAME.SPRINT) {
      // run sprint
      this.runGameFromGames(GAME.SPRINT, Number(hashParts[2]));
    } else if (hashParts.length === 3 && hashParts[1] === GAME.AUDIOCALL) {
      // run audio call
      this.runGameFromGames(GAME.SPRINT, Number(hashParts[2]));
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
