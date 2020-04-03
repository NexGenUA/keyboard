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
              <div class="info">
                <span class="lang-info">Для переключения раскладки нажми Ctrl+Shift</span>
                <span class="caps-block">Caps Lock: <span class="caps off">OFF</span>
                <span class="lang">Language: EN</span>
              </div>
  `,
});
