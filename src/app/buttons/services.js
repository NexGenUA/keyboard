import { Buttons } from './index';

class Services extends Buttons {
  constructor(config) {
    super(config);
    this.name = config.name;
    this.shift = false;
    this.caps = false;
    this.ctrl = false;
    this.observers = [];
  }

  notify() {
    this.observers.forEach((obs) => obs.inform(this.name, this));
  }

  keyDown() {
    if (this.id === 'CapsLock') {
      this.caps = !this.caps;
    } else if (this.name === 'Ctrl') {
      this.ctrl = true;
    } else {
      this.shift = true;
    }
    this.notify();
  }

  keyUp() {
    if (this.name === 'Ctrl') {
      this.ctrl = false;
    } else {
      this.shift = false;
    }
    this.notify();
  }

  register(observer) {
    this.observers.push(observer);
  }
}

const rows = {
  row1: {
    Backspace: 'Backspace',
  },

  row2: {
    Tab: 'Tab',
    Delete: 'Del',
  },

  row3: {
    CapsLock: 'CapsLock',
    Enter: 'Enter',
  },

  row4: {
    ShiftLeft: 'Shift',
    ArrowUp: '↑',
    ShiftRight: 'Shift',
  },

  row5: {
    ControlLeft: 'Ctrl',
    Win: 'Win',
    AltLeft: 'Alt',
    Space: ' ',
    AltRight: 'Alt',
    ArrowLeft: '←',
    ArrowDown: '↓',
    ArrowRight: '→',
    ControlRight: 'Ctrl',
  },
};


const services = {
  row1: [],
  row2: [],
  row3: [],
  row4: [],
  row5: [],
};

Object.keys(services).forEach((key) => {
  Object.entries(rows[key]).forEach((item) => {
    services[key].push(
      new Services({
        id: item[0],
        name: item[1],
      }),
    );
  });
});

export { services };
