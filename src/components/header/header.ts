import BaseComponent from '../baseComponent/baseComponent';

class Header extends BaseComponent {
  inner = `
        <div class="container header__container">
          <nav class="nav">
            <ul class="nav__list">
              <li class="nav__item">
                <a href="#/home" class="nav__link">Главная</a>
              </li>
              <li class="nav__item">
                <a href="#/authorization" class="nav__link">Авторизация</a>
              </li>
              <li class="nav__item">
                <a href="#/textbook" class="nav__link">Учебник</a>
              </li>
              <li class="nav__item">
                <a href="#/games" class="nav__link">Игры</a>
              </li>
              <li class="nav__item">
                <a href="#/statistic" class="nav__link">Статистика</a>
              </li>
            </ul>
          </nav>
          <div class="burger-menu">
            <span></span>        
          </div>
        </div>`;

  constructor() {
    super('header', ['header'], 'header-container');
  }

  create(): void {
    document.body.append(this.container);
    this.container.innerHTML = this.inner;
  }
}

export default Header;
