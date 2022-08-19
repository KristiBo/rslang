import { submit, changeFormAuth } from './authHandler';

export default function listener(): void {
  const form = document.getElementById('form');
  form?.addEventListener('submit', (e) => {
    submit(e);
  });
  const changeFormBtn = document.getElementById('form__change-btn');
  changeFormBtn?.addEventListener('click', changeFormAuth);
}
