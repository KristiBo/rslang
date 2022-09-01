import { Word, GAME } from '../../shared/types';
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
import GamesChooseLevel from '../gamesPage/gamesChooseLevel';

class AppView {
  header: Header;

  homePage: HomePage;

  authPage: AuthPage;

  textbookPage: TextbookPage;

  gamesPage: GamesPage;

  statisticPage: StatisticPage;

  errorPage: ErrorPage;

  footer: Footer;

  burgerMenu: BurgerMenu;

  gamesChooseLevel: GamesChooseLevel;

  constructor() {
    this.header = new Header();
    this.homePage = new HomePage();
    this.authPage = new AuthPage();
    this.gamesPage = new GamesPage(false);
    this.textbookPage = new TextbookPage();
    this.statisticPage = new StatisticPage();
    this.errorPage = new ErrorPage();
    this.footer = new Footer();
    this.burgerMenu = new BurgerMenu();
    this.gamesChooseLevel = new GamesChooseLevel();
  }

  renderPage(pageId: string, data?: Word[], userState?: boolean): void {
    const main: HTMLElement | null = document.querySelector('main');
    // don't remove main for auth
    if (main && pageId !== 'authorization') {
      main.remove();
    }
    switch (pageId) {
      case 'home':
        this.homePage.create();
        break;
      case 'textbook':
        this.textbookPage.create();
        if (data) {
          this.textbookPage.drawCards(data, userState);
        }
        break;
      case 'games':
        this.gamesPage.create();
        // this.gamesPage.initListeners();
        break;
      case 'play/sprint':
        if (data) {
          this.gamesPage.create();
          this.gamesPage.drawSprint(data);
        }
        break;
      case 'play/audiocall':
        if (data) {
          this.gamesPage.create();
          this.gamesPage.drawAudio(data);
        }
        break;
      case 'games/sprint':
        this.gamesChooseLevel.draw(GAME.SPRINT);
        break;
      case 'games/audiocall':
        this.gamesChooseLevel.draw(GAME.AUDIOCALL);
        break;
      case 'statistic':
        this.statisticPage.create();
        break;
      default:
        this.errorPage.create();
    }
  }

  create(): void {
    this.header.create();
    this.homePage.create();
    this.footer.create();
    this.burgerMenu.addListeners();
  }
}

export default AppView;
