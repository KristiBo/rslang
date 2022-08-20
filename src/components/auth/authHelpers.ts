function showErrMessage(text: string): void {
  const elem = document.getElementById('form__error') as HTMLElement;
  elem.innerText = text;
  elem.style.display = 'block';
}

function validateEmail(email: string) {
  // eslint-disable-next-line no-useless-escape
  const reg = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  return reg.test(email);
}

function validatePassword(password: string) {
  const reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*(\W|_)).{5,}$/;
  return reg.test(password);
}

export { showErrMessage, validateEmail, validatePassword };
