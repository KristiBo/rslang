import './basic.css';
import AuthPage from '../authPage/authPage';
import ErrorPage from '../errorPage/errorPage';
import Footer from '../footer/footer';
import GamesPage from '../gamesPage/gamesPage';
import Header from '../header/header';
import HomePage from '../homePage/homePage';
import StatisticPage from '../statisticPage/statisticPage';
import TextbookPage from '../textbookPage/textbookPage';
import BurgerMenu from '../header/burgerMenu';

class App {
  header: Header;

  homePage: HomePage;

  authPage: AuthPage;

  textbookPage: TextbookPage;

  gamesPage: GamesPage;

  statisticPage: StatisticPage;

  errorPage: ErrorPage;

  footer: Footer;

  burgerMenu: BurgerMenu;

  constructor() {
    this.header = new Header();
    this.homePage = new HomePage();
    this.authPage = new AuthPage();
    this.textbookPage = new TextbookPage();
    this.gamesPage = new GamesPage();
    this.statisticPage = new StatisticPage();
    this.errorPage = new ErrorPage();
    this.footer = new Footer();
    this.burgerMenu = new BurgerMenu();
  }

  renderPage(pageId: string): void {
    const main: HTMLElement | null = document.querySelector('main');
    if (main) {
      main.remove();
    }
    switch (pageId) {
      case 'home':
        this.homePage.create();
        break;
      case 'authorization':
        this.authPage.create();
        break;
      case 'textbook':
        this.textbookPage.create();
        break;
      case 'games':
        this.gamesPage.create();
        break;
      case 'statistic':
        this.statisticPage.create();
        break;
      default:
        this.errorPage.create();
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
    this.footer.create();
    this.burgerMenu.addListeners();
  }
}

export default App;
