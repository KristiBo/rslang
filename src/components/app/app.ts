import AuthPage from '../authPage/authPage';
import BaseComponent from '../baseComponent/baseComponent';
import GamesPage from '../gamesPage/gamesPage';
import Header from '../header/header';
import HomePage from '../homePage/homePage';
import StatisticPage from '../statisticPage/statisticPage';
import TextbookPage from '../textbookPage/textbookPage';

class App {
  header: Header;

  homePage: HomePage;

  authPage: AuthPage;

  textbookPage: TextbookPage;

  gamesPage: GamesPage;

  statisticPage: StatisticPage;

  constructor() {
    this.header = new Header();
    this.homePage = new HomePage();
    this.authPage = new AuthPage();
    this.textbookPage = new TextbookPage();
    this.gamesPage = new GamesPage();
    this.statisticPage = new StatisticPage();
  }

  renderPage(pageId: string): void {
    let currentPage: BaseComponent | null = null;
    const main: HTMLElement | null = document.querySelector('main');
    if (main) {
      main.remove();
    }
    // eslint-disable-next-line default-case
    switch (pageId) {
      case 'home':
        currentPage = this.homePage;
        break;
      case 'authorization':
        currentPage = this.authPage;
        break;
      case 'textbook':
        currentPage = this.textbookPage;
        break;
      case 'games':
        currentPage = this.gamesPage;
        break;
      case 'statistic':
        currentPage = this.statisticPage;
        break;
    }
    if (currentPage) {
      currentPage.create();
    }
  }

  changeHash() {
    window.addEventListener('hashchange', () => {
      const hash = window.location.hash.substring(2);
      this.renderPage(hash);
    });
  }

  create(): void {
    this.header.create();
    this.homePage.create();
    this.changeHash();
  }
}

export default App;
