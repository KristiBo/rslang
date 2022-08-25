import Model from '../model/model';
import TextbookPage from './textbookPage';

const INITIAL_PAGE_NR = 1;
const LAST_PAGE_NR = 30;

class Pagination {
  pageNr: number;

  groupNr: number;

  model: Model;

  book: TextbookPage;

  constructor() {
    this.pageNr = INITIAL_PAGE_NR;
    this.groupNr = INITIAL_PAGE_NR;
    this.model = new Model();
    this.book = new TextbookPage();
  }

  addListenersToBtns(): void {
    const btnStart = document.querySelector('.button_start') as HTMLButtonElement;
    const btnPrev = document.querySelector('.button_prev') as HTMLButtonElement;
    const btnNext = document.querySelector('.button_next') as HTMLButtonElement;
    const btnEnd = document.querySelector('.button_end') as HTMLButtonElement;
    const cards = document.querySelector('.textbook__cards') as HTMLButtonElement;
    const levelBtns = document.querySelectorAll('.button_level');
    levelBtns.forEach((el) => {
      el.addEventListener('click', () => {
        this.groupNr = Number(el.innerHTML);
        cards.innerHTML = '';
        this.changeWords();
        levelBtns.forEach((elem) => elem.classList.remove('active'));
        el.classList.add('active');
      });
    });
    btnNext.addEventListener('click', () => this.goToNextPage());
    btnPrev.addEventListener('click', () => this.goToPrevPage());
    btnEnd.addEventListener('click', () => this.goToLastPage());
    btnStart.addEventListener('click', () => this.goToFirstPage());
  }

  getActiveNextBtn(): void {
    const btnNext = document.querySelector('.button_next') as HTMLButtonElement;
    const btnEnd = document.querySelector('.button_end') as HTMLButtonElement;
    btnNext.disabled = false;
    btnEnd.disabled = false;
  }

  getDisabledNextBtn(): void {
    const btnEnd = document.querySelector('.button_end') as HTMLButtonElement;
    const btnNext = document.querySelector('.button_next') as HTMLButtonElement;
    btnNext.disabled = true;
    btnEnd.disabled = true;
  }

  getActivePrevBtn(): void {
    const btnStart = document.querySelector('.button_start') as HTMLButtonElement;
    const btnPrev = document.querySelector('.button_prev') as HTMLButtonElement;
    btnStart.disabled = false;
    btnPrev.disabled = false;
  }

  getDisabledPrevBtn(): void {
    const btnStart = document.querySelector('.button_start') as HTMLButtonElement;
    const btnPrev = document.querySelector('.button_prev') as HTMLButtonElement;
    btnStart.disabled = true;
    btnPrev.disabled = true;
  }

  changePageNumber(): void {
    const btnNumber = document.querySelector('.button_number') as HTMLButtonElement;
    btnNumber.textContent = `${this.pageNr}`;
  }

  async changeWords(): Promise<void> {
    const page = this.pageNr - 1;
    const group = this.groupNr - 1;
    const [words] = await this.model.api.getWords(group, page);
    if (words) {
      this.book.drawCards(words);
    }
  }

  addNewWords(): void {
    const cards = document.querySelector('.textbook__cards') as HTMLButtonElement;
    cards.innerHTML = '';
    this.changeWords();
  }

  goToFirstPage(): void {
    this.pageNr = INITIAL_PAGE_NR;
    this.changePageNumber();
    this.getDisabledPrevBtn();
    this.getActiveNextBtn();
    this.addNewWords();
  }

  goToLastPage(): void {
    this.pageNr = LAST_PAGE_NR;
    this.changePageNumber();
    this.getActivePrevBtn();
    this.getDisabledNextBtn();
    this.addNewWords();
  }

  goToNextPage(): void {
    this.pageNr += 1;
    this.changePageNumber();
    if (this.pageNr >= LAST_PAGE_NR) this.getDisabledNextBtn();
    this.getActivePrevBtn();
    this.addNewWords();
  }

  goToPrevPage(): void {
    this.pageNr -= 1;
    this.changePageNumber();
    if (this.pageNr <= INITIAL_PAGE_NR) this.getDisabledPrevBtn();
    this.getActiveNextBtn();
    this.addNewWords();
  }
}

export default Pagination;
