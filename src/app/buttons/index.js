export class Buttons {
  constructor(config) {
    this.id = config.id;
  }

  setActive() {
    const element = document.querySelector(`.${this.id.toLowerCase()}`);
    element.classList.add('active');
  }

  removeActive() {
    const element = document.querySelector(`.${this.id.toLowerCase()}`);
    element.classList.remove('active');
  }
}
