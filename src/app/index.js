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
  elements: `<div class="info develop">
                <p class="develop-info">Разработано в OS Ubuntu, протестировано в OS Windows под браузеры Chrome, Opera и Firefox</p>
              </div>
              <app-keyboard class="app-keyboard" id="app-keyboard">
                  <textarea class="keyboard-print" id="keyboard-print" spellcheck="false"></textarea>
              </app-keyboard>
              <div class="info">
                <span class="lang-info">Для переключения раскладки нажми Ctrl+Shift</span>
                <span class="caps-block">Caps Lock: <span class="caps off">OFF</span>
                <span class="lang">Language: EN</span>
              </div>
  `,
});
