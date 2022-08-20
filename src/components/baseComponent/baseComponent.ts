class BaseComponent {
  container: HTMLElement;

  inner!: string;

  constructor(tagName: string, className: string, idName: string) {
    this.container = document.createElement(tagName);
    this.container.classList.add(className);
    this.container.id = idName;
  }

  create(): void {
    if (this.container) {
      document.body.append(this.container);
      this.container.innerHTML = this.inner;
    }
  }
}

export default BaseComponent;
