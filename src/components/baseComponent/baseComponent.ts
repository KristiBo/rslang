class BaseComponent {
  container: HTMLElement;

  inner!: string;

  constructor(tagName: string, className: string[], idName: string) {
    this.container = document.createElement(tagName);
    this.container.classList.add(className.join(','));
    this.container.id = idName;
  }

  create(): void {
    const header = document.querySelector('header');
    if (header) {
      header.after(this.container);
    }
    this.container.innerHTML = this.inner;
  }
}

export default BaseComponent;
