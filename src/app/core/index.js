import { alphaDigital } from '../buttons/alpha-digital';
import { services } from '../buttons/services';

class MainKeyboard {
  constructor() {
    this.createNodes = (el) => {
      const node = document.createElement('input');
      node.name = el.id;
      node.value = String.fromCodePoint(el.current);
      node.type = 'button';
      node.classList = `button ${el.id.toLowerCase()}`;
      return node;
    };

    this.createServices = (node, obj, option) => {
      node.insertAdjacentHTML(option, `
       <input name="${obj.id}" type="button" value="${obj.name}" class="button ${obj.id.toLowerCase()}">`);
    };

    this.createServicesNodes = (el) => {
      const node = document.createElement('input');
      node.name = el.id;
      node.value = el.name;
      node.type = 'button';
      node.classList = `button ${el.id.toLowerCase()}`;
      return node;
    };

    this.servicesKeys = Object.values(services).flat();
    this.alphaDigKeys = Object.values(alphaDigital).flat();
    this.allButtons = [...this.servicesKeys, ...this.alphaDigKeys];
    this.alphaDigitNodes = [];

    this.nodesData = () => {
      const obj = {};
      this.alphaDigKeys.forEach((data) => {
        obj[data.id] = data;
      });
      return obj;
    };
  }

  start() {
    this.init();
    this.pressKey();
    this.upKey();
    this.setObserve();
    this.onclick();
  }

  init() {
    const appKeyboard = document.querySelector('#app-keyboard');
    this.render(appKeyboard);
    this.addServices(appKeyboard);
    const area = document.querySelector('#keyboard-print');
    area.onkeypress = () => false;
    area.onkeydown = () => false;
    area.onblur = () => area.focus();
  }

  render(appKeyboard) {
    const keyboard = document.createElement('div');
    keyboard.classList.add('keyboard');
    keyboard.setAttribute('id', 'keyboard');

    Object.keys(alphaDigital).forEach((key) => {
      const node = alphaDigital[key].map(this.createNodes);
      const row = document.createElement('div');
      row.classList.add('row');
      row.append(...node);
      keyboard.append(row);
      appKeyboard.append(keyboard);
      this.alphaDigitNodes = this.alphaDigitNodes.concat(node);
    });
  }

  addServices(appKeyboard) {
    const rows = appKeyboard.getElementsByTagName('div');
    const keyboard = appKeyboard.querySelector('.keyboard');
    this.createServices(rows[1], services.row1[0], 'beforeend');
    this.createServices(rows[2], services.row2[0], 'afterbegin');
    this.createServices(rows[2], services.row2[1], 'beforeend');
    this.createServices(rows[3], services.row3[0], 'afterbegin');
    this.createServices(rows[3], services.row3[1], 'beforeend');
    this.createServices(rows[4], services.row4[0], 'afterbegin');
    this.createServices(rows[4], services.row4[1], 'beforeend');
    this.createServices(rows[4], services.row4[2], 'beforeend');
    const servicesNodes = services.row5.map(this.createServicesNodes);
    const row = document.createElement('div');
    row.classList.add('row');
    row.append(...servicesNodes);
    keyboard.append(row);
  }

  pressKey() {
    document.addEventListener('keydown', (e) => {
      const btn = this.alphaDigKeys.find((key) => key.id === e.code);
      if (btn) {
        const value = String.fromCodePoint(btn.current);
        this.changeInput(value);
      }

      this.allButtons.find((key) => key.id === e.code).setActive();
    });
  }

  upKey() {
    document.addEventListener('keyup', (e) => {
      this.allButtons.find((key) => key.id === e.code).removeActive();
    });
  }

  setObserve() {
    const regexp = /CapsLock|ShiftLeft|ShiftRight|ControlLeft|ControlRight/i;
    const serviceKeys = this.servicesKeys.filter((btn) => regexp.test(btn.id));
    this.alphaDigKeys.forEach((key) => serviceKeys.forEach((obj) => obj.register(key)));
    this.handleServicesBtn(serviceKeys);
  }

  update() {
    const nodesData = this.nodesData();
    this.alphaDigitNodes.forEach((input) => {
      input.value = String.fromCodePoint(nodesData[input.name].current);
    });
  }

  handleServicesBtn(serviceKeys) {
    const shiftHandle = (e) => {
      const { type } = e;
      if (e.code === 'Space' && type === 'keydown') {
        this.changeInput(' ');
        return;
      }

      if (e.code === 'Delete' && type === 'keydown') {
        this.changeInput('delete');
        return;
      }

      if (e.code === 'Enter' && type === 'keydown') {
        this.changeInput('enter');
        return;
      }

      if (e.code === 'Backspace' && type === 'keydown') {
        this.changeInput('backspace');
        return;
      }

      if (e.code === 'ArrowLeft' && type === 'keydown') {
        this.arrow('left');
        return;
      }

      serviceKeys.forEach((btn) => {
        if (e.code !== btn.id) return;
        if (btn.name === 'Shift') {
          type === 'keydown' ? btn.keyDown() : btn.keyUp();
          this.update();
        } else if (btn.name === 'CapsLock') {
          if (type !== 'keydown') return;
          btn.keyDown();
          this.update();
        } else if (btn.name === 'Ctrl') {
          type === 'keydown' ? btn.keyDown() : btn.keyUp();
        }
      });
    };

    document.addEventListener('keydown', shiftHandle);
    document.addEventListener('keyup', shiftHandle);
  }

  onclick() {
    const keyboard = document.getElementById('keyboard');
    const caps = this.servicesKeys.find((btn) => btn.id === 'CapsLock');
    const shift = this.servicesKeys.find((btn) => btn.id === 'ShiftLeft');

    const mouseClick = (e) => {
      const { type } = e;

      const button = e.target;
      const regexp = /^[←↓→↑]|.{2,}$/i;

      if (button.tagName !== 'INPUT') return;

      const { value } = button;

      if (value === 'Del' && type === 'mousedown') {
        this.changeInput('delete');
        return;
      }
      if (value === 'Backspace' && type === 'mousedown') {
        this.changeInput('backspace');
        return;
      }

      if (value === 'Enter' && type === 'mousedown') {
        this.changeInput('enter');
        return;
      }

      if (value === 'CapsLock' && type === 'mousedown') {
        caps.keyDown();
        this.update();
        return;
      }

      if (value === 'Shift') {
        type === 'mousedown' ? shift.keyDown() : shift.keyUp();
        this.update();
        return;
      }

      if (type === 'mouseup') return;
      if (regexp.test(value)) return;
      this.changeInput(value);
    };

    keyboard.addEventListener('mousedown', mouseClick);
    keyboard.addEventListener('mouseup', mouseClick);
  }

  changeInput(value) {
    const area = document.querySelector('#keyboard-print');
    let start = area.selectionStart;
    let end = area.selectionEnd;

    if (value === 'delete') {
      if (start < area.value.length && start === end) end++;
      area.setRangeText('', start, end, 'end');
      return;
    }

    if (value === 'backspace') {
      if (start > 0 && start === end) start--;
      area.setRangeText('', start, end, 'end');
      return;
    }

    if (value === 'enter') {
      area.setRangeText('\n', start, end, 'end');
      return;
    }

    area.setRangeText(value, start, end, 'end');
    area.focus();
  }

  arrow(direction) {
    switch (direction) {
      case 'left':

        break;
      case 'right':
        break;
      case 'up':
        break;
      case 'down':

    }
  }
}

export const mainKeyboard = new MainKeyboard();
