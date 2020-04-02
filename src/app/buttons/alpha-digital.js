import { Buttons } from './index';

class AlphaDigital extends Buttons {
  constructor(config) {
    super(config);
    this.ru = config.ru;
    this.en = config.en;
    this.lang = this.en;
    this.ctrl = false;
    this.caps = false;
    [this.current] = config.en;
    this.symbols = /[a-zа-яё]/i;
  }

  inform(id, value) {
    switch (id) {
      case 'Shift': {
        const code = this.lang[0];
        if (this.ctrl && value.shift && this.lang === this.en) {
          this.lang = this.ru;
        } else if (this.ctrl && value.shift && this.lang === this.ru) {
          this.lang = this.en;
        }
        if (value.shift && this.caps) {
          if (!this.symbols.test(String.fromCodePoint(code))) {
            this.current = this.lang[1];
            return;
          }
          this.current = this.lang[0];
        } else if (!value.shift && this.caps) {
          if (!this.symbols.test(String.fromCodePoint(code))) {
            this.current = this.lang[0];
            return;
          }
          this.current = this.lang[1];
        } else if (value.shift && !value.caps) {
          this.current = this.lang[1];
        } else {
          this.current = this.lang[0];
        }
        break;
      }
      case 'CapsLock': {
        this.caps = value.caps;
        if (value.caps) {
          const code = this.lang[0];
          if (!this.symbols.test(String.fromCodePoint(code))) return;
          this.current = this.lang[1];
        } else {
          this.current = this.lang[0];
        }
        break;
      } case 'Ctrl': {
        this.ctrl = value.ctrl;
        break;
      }
    }
  }
}


const rows = {
  row1: {
    Backquote: [[96, 126], [1105, 1025]],
    Digit1: [[49, 33], [49, 33]],
    Digit2: [[50, 64], [50, 34]],
    Digit3: [[51, 35], [51, 8470]],
    Digit4: [[52, 36], [52, 59]],
    Digit5: [[53, 37], [53, 37]],
    Digit6: [[54, 94], [54, 58]],
    Digit7: [[55, 38], [55, 63]],
    Digit8: [[56, 42], [56, 42]],
    Digit9: [[57, 40], [57, 40]],
    Digit0: [[48, 41], [48, 41]],
    Minus: [[45, 95], [45, 95]],
    Equal: [[61, 43], [61, 43]],
  },

  row2: {
    KeyQ: [[113, 81], [1081, 1049]],
    KeyW: [[119, 87], [1094, 1062]],
    KeyE: [[101, 69], [1091, 1059]],
    KeyR: [[114, 82], [1082, 1050]],
    KeyT: [[116, 84], [1077, 1045]],
    KeyY: [[121, 89], [1085, 1053]],
    KeyU: [[117, 85], [1075, 1043]],
    KeyI: [[105, 73], [1096, 1064]],
    KeyO: [[111, 79], [1097, 1065]],
    KeyP: [[112, 80], [1079, 1047]],
    BracketLeft: [[91, 123], [1093, 1061]],
    BracketRight: [[93, 125], [1098, 1066]],
    Backslash: [[92, 124], [92, 47]],
  },

  row3: {
    KeyA: [[97, 65], [1092, 1060]],
    KeyS: [[115, 83], [1099, 1067]],
    KeyD: [[100, 68], [1074, 1042]],
    KeyF: [[102, 70], [1072, 1040]],
    KeyG: [[103, 71], [1087, 1055]],
    KeyH: [[104, 72], [1088, 1056]],
    KeyJ: [[106, 74], [1086, 1054]],
    KeyK: [[107, 75], [1083, 1051]],
    KeyL: [[108, 76], [1076, 1044]],
    Semicolon: [[59, 58], [1078, 1046]],
    Quote: [[39, 34], [1101, 1069]],
  },

  row4: {
    KeyZ: [[122, 90], [1103, 1071]],
    KeyX: [[120, 88], [1095, 1063]],
    KeyC: [[99, 67], [1089, 1057]],
    KeyV: [[118, 86], [1084, 1052]],
    KeyB: [[98, 66], [1080, 1048]],
    KeyN: [[110, 78], [1090, 1058]],
    KeyM: [[109, 77], [1100, 1068]],
    Comma: [[44, 60], [1073, 1041]],
    Period: [[46, 62], [1102, 1070]],
    Slash: [[47, 63], [46, 44]],
  },
};


const alphaDigital = {
  row1: [],
  row2: [],
  row3: [],
  row4: [],
};

Object.keys(alphaDigital).forEach((key) => {
  Object.entries(rows[key]).forEach((item) => {
    alphaDigital[key].push(
      new AlphaDigital({
        id: item[0],
        en: item[1][0],
        ru: item[1][1],
      }),
    );
  });
});

export { alphaDigital };
