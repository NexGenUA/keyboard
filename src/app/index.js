class AppModule {
  constructor(config) {
    this.selector = config.selector;
    this.elements = config.elements;
  }

  start() {
    this.init();
  }

  init() {
    const appKeyboard = document.querySelector(this.selector);
    appKeyboard.innerHTML = this.elements;
  }
}

export const appModule = new AppModule({
  selector: 'body',
  elements: `
              <app-keyboard class="app-keyboard" id="app-keyboard">
                  <textarea class="keyboard-print" id="keyboard-print"></textarea>
              </app-keyboard>
  `,
});
