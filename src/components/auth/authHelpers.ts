function isValidEmail(email: string): boolean {
  // eslint-disable-next-line no-useless-escape
  const reg = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  return reg.test(email);
}

function isValidPassword(password: string): boolean {
  const reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*(\W|_)).{5,}$/;
  return reg.test(password);
}

export { isValidEmail, isValidPassword };
