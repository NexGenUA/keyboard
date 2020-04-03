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
        if (btn.ctrl) return;
        this.changeInput(value);
      }

      const button = this.allButtons.find((key) => key.id === e.code);
      if (button) button.setActive();
    });
  }

  upKey() {
    document.addEventListener('keyup', (e) => {
      const button = this.allButtons.find((key) => key.id === e.code);
      if (button) button.removeActive();
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
      const { type, code } = e;
      if (code === 'Space' && type === 'keydown') {
        this.changeInput(' ');
        return;
      }

      if (code === 'Delete' && type === 'keydown') {
        this.changeInput('delete');
        return;
      }

      if (code === 'Enter' && type === 'keydown') {
        this.changeInput('enter');
        return;
      }

      if (code === 'Backspace' && type === 'keydown') {
        this.changeInput('backspace');
        return;
      }

      if (code === 'ArrowLeft' && type === 'keydown') {
        this.arrow('left');
        return;
      }

      if (code === 'ArrowRight' && type === 'keydown') {
        this.arrow('right');
        return;
      }

      if (code === 'ArrowUp' && type === 'keydown') {
        this.arrow('up');
        return;
      }

      if (code === 'ArrowDown' && type === 'keydown') {
        this.arrow('down');
        return;
      }

      if (code === 'Tab' && type === 'keydown') {
        this.changeInput('tab');
        return;
      }

      serviceKeys.forEach((btn) => {
        if (code !== btn.id) return;
        if (btn.name === 'Shift') {
          type === 'keydown' ? btn.keyDown() : btn.keyUp();
          this.update();
        } else if (btn.name === 'CapsLock') {
          if (type !== 'keydown') return;
          btn.keyDown();
          this.update();
          this.capsSwitch(btn.caps);
        } else if (btn.name === 'Ctrl') {
          type === 'keydown' ? btn.keyDown() : btn.keyUp();
          this.update();
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

      const { value, name } = button;

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
        this.capsSwitch(caps.caps);
        return;
      }

      if (value === 'Shift') {
        type === 'mousedown' ? shift.keyDown() : shift.keyUp();
        this.update();
        return;
      }
      if (name === 'ArrowLeft' && type === 'mousedown') {
        this.arrow('left');
        return;
      }

      if (name === 'ArrowRight' && type === 'mousedown') {
        this.arrow('right');
        return;
      }

      if (name === 'ArrowUp' && type === 'mousedown') {
        this.arrow('up');
        return;
      }

      if (name === 'ArrowDown' && type === 'mousedown') {
        this.arrow('down');
        return;
      }

      if (name === 'Tab' && type === 'mousedown') {
        this.changeInput('tab');
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

    if (value === 'tab') {
      area.setRangeText('\t', start, end, 'end');
      return;
    }

    area.setRangeText(value, start, end, 'end');
    area.focus();
  }

  arrow(direction) {
    const area = document.querySelector('#keyboard-print');
    let start = area.selectionStart;
    let end = area.selectionEnd;
    const getCursorPosition = () => {
      const linesLength = area.value.split('\n').map((arr) => arr.length + 1);
      let idx = 0;
      let pos = 0;
      linesLength.reduce((acc, line, i) => {
        if (start >= acc) {
          pos = start - acc;
          idx = i;
        }
        return line + acc;
      }, 0);
      return { linesLength, idx, pos };
    };

    switch (direction) {
      case 'left':
        if (start > 0 && start === end) area.selectionEnd = --start;
        if (start > 0 && start !== end) area.selectionEnd = start;
        break;
      case 'right':
        if (start < area.value.length && start === end) area.selectionStart = ++end;
        if (start < area.value.length && start !== end) area.selectionStart = end;
        break;
      case 'up': {
        const { linesLength, idx, pos } = getCursorPosition();
        if (idx <= 0) return;
        const len = linesLength[idx - 1];
        const newPos = len === 1 ? start - pos - 1 : start - len;
        area.selectionEnd = pos >= len ? start - pos - 1 : newPos;
        break;
      }
      case 'down': {
        const { linesLength, idx, pos } = getCursorPosition();
        if (idx >= linesLength.length - 1) return;
        const len = linesLength[idx + 1];
        const curLen = linesLength[idx];
        const newPos = len === 1 ? start + linesLength[idx] - pos : start + linesLength[idx];
        area.selectionStart = pos >= len ? start - pos + len + curLen - 1 : newPos;
      }
    }
  }

  capsSwitch(value) {
    const span = document.querySelector('.caps');
    if (value) {
      span.innerHTML = 'ON';
      span.classList.add('on');
    } else {
      span.innerHTML = 'OFF';
      span.classList.remove('on');
    }
  }

  languageSwitch(lang) {
    const span = document.querySelector('.lang');

  }
}

export const mainKeyboard = new MainKeyboard();
