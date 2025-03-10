(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}(g.PLUGINS || (g.PLUGINS = {})).Tone = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _DrumKit = _interopRequireDefault(require("./instruments/DrumKit.js"));
var _startUp = _interopRequireDefault(require("./jingles/start-up.js"));
var _keyCodes = _interopRequireDefault(require("./keyCodes.js"));
var _harmonicShift = _interopRequireDefault(require("./util/harmonicShift.js"));
var _playJingle = _interopRequireDefault(require("./util/playJingle.js"));
var _playSpatialSound = _interopRequireDefault(require("./util/playSpatialSound.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); } // Tone.js - Mantra Plugin - Marak Squires 2023
// Tone.js - https://tonejs.github.io/
// import * as Tone from 'tone'; <-- import if needed, otherwise it will be loaded from vendor
var TonePlugin = /*#__PURE__*/function () {
  // indicates that this plugin has async initialization and should should emit ready event

  function TonePlugin() {
    _classCallCheck(this, TonePlugin);
    this.id = TonePlugin.id;
    this.playIntro = false;
    this.userEnabled = false;
    this.lastNotePlayed = null;
    this.keyCodes = _keyCodes["default"];
    this.toneStarted = false;
  }
  _createClass(TonePlugin, [{
    key: "init",
    value: function init(game) {
      var _this = this;
      this.game = game;
      this.bindUtilityFunctions();
      if (typeof Tone === 'undefined') {
        console.log('Tone is not defined, attempting to load it from vendor');
        game.loadScripts(['/vendor/tone.min.js'], function () {
          return _this.toneReady();
        });
      } else {
        this.toneReady();
      }
    }
  }, {
    key: "bindUtilityFunctions",
    value: function bindUtilityFunctions() {
      this.harmonicShift = _harmonicShift["default"].bind(this);
      this.playJingle = _playJingle["default"].bind(this);
      this.playSpatialSound = _playSpatialSound["default"].bind(this);
      this.game.systemsManager.addSystem(this.id, this);
    }
  }, {
    key: "toneReady",
    value: function toneReady() {
      this.synth = new Tone.Synth().toDestination();
      this.drumKit = new _DrumKit["default"]();
      this.limiter = new Tone.Limiter(-6).toDestination();
      this.synth.connect(this.limiter);
      this.synth.volume.value = -3;
      Tone.Transport.lookAhead = 0.5;
      this.game.playSpatialSound = this.playSpatialSound;
      this.game.playDrum = this.playDrum.bind(this);
      this.game.playNote = this.playNote.bind(this);
      console.log('Tone is ready', _startUp["default"]);
      if (this.playIntro) {
        this.playJingle(_startUp["default"]);
      }
      this.game.emit('plugin::ready::tone', this);
    }
  }, {
    key: "playNote",
    value: function playNote(note, duration) {
      var now = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      var velocity = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0.5;
      velocity = Math.min(Math.max(velocity, 0), 0.5);
      note = note || this.selectRandomNote();
      this.lastNotePlayed = note;
      try {
        this.synth.triggerAttackRelease(note, duration, now, velocity);
      } catch (err) {
        console.log('WARNING: Tone.js synth not ready yet. Skipping note play', err);
      }
    }
  }, {
    key: "playDrum",
    value: function playDrum() {
      var sound = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'kick';
      this.startTone();
      this.drumKit.play(sound);
    }
  }, {
    key: "startTone",
    value: function startTone() {
      if (!this.toneStarted) {
        Tone.start();
        this.toneStarted = true;
      }
    }
  }, {
    key: "selectRandomNote",
    value: function selectRandomNote() {
      var keys = Object.keys(this.keyCodes);
      var randomKey = keys[Math.floor(Math.random() * keys.length)];
      if (this.lastNotePlayed) {
        randomKey = this.harmonicShift(this.lastNotePlayed, {
          type: 'perfectFifth'
        }) || this.harmonicShift('C4', {
          type: 'perfectFifth'
        });
      }
      return this.keyCodes[randomKey].toneCode;
    }
  }]);
  return TonePlugin;
}();
_defineProperty(TonePlugin, "id", 'tone');
_defineProperty(TonePlugin, "async", true);
var _default = exports["default"] = TonePlugin;

},{"./instruments/DrumKit.js":2,"./jingles/start-up.js":3,"./keyCodes.js":4,"./util/harmonicShift.js":5,"./util/playJingle.js":6,"./util/playSpatialSound.js":7}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var DrumKit = exports["default"] = /*#__PURE__*/function () {
  function DrumKit() {
    _classCallCheck(this, DrumKit);
    this.kick = new Tone.MembraneSynth().toDestination();
    this.snare = new Tone.NoiseSynth({
      noise: {
        type: 'white'
      },
      envelope: {
        attack: 0.005,
        decay: 0.1,
        sustain: 0
      }
    }).toDestination();
    this.hiHatClosed = new Tone.MetalSynth({
      frequency: 200,
      envelope: {
        attack: 0.001,
        decay: 0.1,
        sustain: 0
      },
      harmonicity: 5.1,
      modulationIndex: 32,
      resonance: 4000,
      octaves: 1.5
    }).toDestination();
    this.hiHatOpen = new Tone.MetalSynth({
      frequency: 200,
      envelope: {
        attack: 0.001,
        decay: 0.3,
        sustain: 0
      },
      harmonicity: 5.1,
      modulationIndex: 32,
      resonance: 4000,
      octaves: 1.5
    }).toDestination();
    this.tomLow = new Tone.MembraneSynth({
      pitchDecay: 0.05,
      octaves: 4,
      oscillator: {
        type: 'sine'
      },
      envelope: {
        attack: 0.001,
        decay: 0.4,
        sustain: 0.01
      }
    }).toDestination();
    this.tomHigh = new Tone.MembraneSynth({
      pitchDecay: 0.05,
      octaves: 6,
      oscillator: {
        type: 'sine'
      },
      envelope: {
        attack: 0.001,
        decay: 0.2,
        sustain: 0.01
      }
    }).toDestination();
  }
  _createClass(DrumKit, [{
    key: "play",
    value: function play(sound) {
      switch (sound) {
        case 'kick':
          this.kick.triggerAttackRelease('C1', '8n');
          break;
        case 'snare':
          this.snare.triggerAttackRelease('8n');
          break;
        case 'hat':
          this.hiHatClosed.triggerAttackRelease('32n');
          break;
        case 'hiHatClosed':
          this.hiHatClosed.triggerAttackRelease('32n');
          break;
        case 'hiHatOpen':
          this.hiHatOpen.triggerAttackRelease('8n');
          break;
        case 'tomLow':
          this.tomLow.triggerAttackRelease('G2', '8n');
          break;
        case 'tomHigh':
          this.tomHigh.triggerAttackRelease('A4', '8n');
          break;
        default:
          console.log('Unknown drum sound');
      }
    }
  }]);
  return DrumKit;
}();

},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _default = exports["default"] = {
  "header": {
    "keySignatures": [],
    "meta": [],
    "name": "Single Staff",
    "ppq": 480,
    "tempos": [{
      "bpm": 145.03368407312598,
      "ticks": 0
    }],
    "timeSignatures": [{
      "ticks": 0,
      "timeSignature": [4, 4],
      "measures": 0
    }]
  },
  "tracks": [{
    "channel": 0,
    "controlChanges": {
      "0": [{
        "number": 0,
        "ticks": 0,
        "time": 0,
        "value": 0
      }],
      "32": [{
        "number": 32,
        "ticks": 0,
        "time": 0,
        "value": 0
      }]
    },
    "pitchBends": [],
    "instrument": {
      "family": "piano",
      "number": 0,
      "name": "acoustic grand piano"
    },
    "name": "Track 1",
    "notes": [],
    "endOfTrackTicks": 7680
  }, {
    "channel": 0,
    "controlChanges": {},
    "pitchBends": [],
    "instrument": {
      "family": "reed",
      "number": 71,
      "name": "clarinet"
    },
    "name": "",
    "notes": [{
      "duration": 0.13100404999999998,
      "durationTicks": 152,
      "midi": 55,
      "name": "G3",
      "ticks": 0,
      "time": 0,
      "velocity": 0.7874015748031497
    }, {
      "duration": 0.13100404999999998,
      "durationTicks": 152,
      "midi": 60,
      "name": "C4",
      "ticks": 159,
      "time": 0.13703713125,
      "velocity": 0.7874015748031497
    }, {
      "duration": 0.13014218125,
      "durationTicks": 151,
      "midi": 64,
      "name": "E4",
      "ticks": 319,
      "time": 0.27493613125,
      "velocity": 0.7874015748031497
    }, {
      "duration": 0.13100405000000004,
      "durationTicks": 152,
      "midi": 67,
      "name": "G4",
      "ticks": 480,
      "time": 0.413697,
      "velocity": 0.7874015748031497
    }, {
      "duration": 0.13100404999999993,
      "durationTicks": 152,
      "midi": 72,
      "name": "C5",
      "ticks": 639,
      "time": 0.55073413125,
      "velocity": 0.7874015748031497
    }, {
      "duration": 0.1301421812500001,
      "durationTicks": 151,
      "midi": 76,
      "name": "E5",
      "ticks": 799,
      "time": 0.6886331312499999,
      "velocity": 0.7874015748031497
    }, {
      "duration": 0.3930121500000001,
      "durationTicks": 456,
      "midi": 79,
      "name": "G5",
      "ticks": 960,
      "time": 0.827394,
      "velocity": 0.7874015748031497
    }, {
      "duration": 0.3930121500000001,
      "durationTicks": 456,
      "midi": 76,
      "name": "E5",
      "ticks": 1440,
      "time": 1.241091,
      "velocity": 0.7874015748031497
    }, {
      "duration": 0.13100404999999982,
      "durationTicks": 152,
      "midi": 56,
      "name": "G#3",
      "ticks": 1920,
      "time": 1.654788,
      "velocity": 0.7874015748031497
    }, {
      "duration": 0.13100405000000004,
      "durationTicks": 152,
      "midi": 60,
      "name": "C4",
      "ticks": 2079,
      "time": 1.7918251312499998,
      "velocity": 0.7874015748031497
    }, {
      "duration": 0.1301421812500001,
      "durationTicks": 151,
      "midi": 63,
      "name": "D#4",
      "ticks": 2239,
      "time": 1.92972413125,
      "velocity": 0.7874015748031497
    }, {
      "duration": 0.13100405000000004,
      "durationTicks": 152,
      "midi": 68,
      "name": "G#4",
      "ticks": 2400,
      "time": 2.068485,
      "velocity": 0.7874015748031497
    }, {
      "duration": 0.1310040499999996,
      "durationTicks": 152,
      "midi": 72,
      "name": "C5",
      "ticks": 2559,
      "time": 2.20552213125,
      "velocity": 0.7874015748031497
    }, {
      "duration": 0.1301421812500001,
      "durationTicks": 151,
      "midi": 75,
      "name": "D#5",
      "ticks": 2719,
      "time": 2.34342113125,
      "velocity": 0.7874015748031497
    }, {
      "duration": 0.3930121500000001,
      "durationTicks": 456,
      "midi": 80,
      "name": "G#5",
      "ticks": 2880,
      "time": 2.482182,
      "velocity": 0.7874015748031497
    }, {
      "duration": 0.3930121500000001,
      "durationTicks": 456,
      "midi": 75,
      "name": "D#5",
      "ticks": 3360,
      "time": 2.895879,
      "velocity": 0.7874015748031497
    }, {
      "duration": 0.13100405000000004,
      "durationTicks": 152,
      "midi": 58,
      "name": "A#3",
      "ticks": 3840,
      "time": 3.309576,
      "velocity": 0.7874015748031497
    }, {
      "duration": 0.1310040499999996,
      "durationTicks": 152,
      "midi": 62,
      "name": "D4",
      "ticks": 3999,
      "time": 3.4466131312500004,
      "velocity": 0.7874015748031497
    }, {
      "duration": 0.1301421812500001,
      "durationTicks": 151,
      "midi": 65,
      "name": "F4",
      "ticks": 4159,
      "time": 3.5845121312499995,
      "velocity": 0.7874015748031497
    }, {
      "duration": 0.13100405000000004,
      "durationTicks": 152,
      "midi": 70,
      "name": "A#4",
      "ticks": 4320,
      "time": 3.723273,
      "velocity": 0.7874015748031497
    }, {
      "duration": 0.1310040499999996,
      "durationTicks": 152,
      "midi": 74,
      "name": "D5",
      "ticks": 4479,
      "time": 3.8603101312500003,
      "velocity": 0.7874015748031497
    }, {
      "duration": 0.1301421812500001,
      "durationTicks": 151,
      "midi": 77,
      "name": "F5",
      "ticks": 4639,
      "time": 3.9982091312499994,
      "velocity": 0.7874015748031497
    }, {
      "duration": 0.39301214999999967,
      "durationTicks": 456,
      "midi": 82,
      "name": "A#5",
      "ticks": 4800,
      "time": 4.13697,
      "velocity": 0.7874015748031497
    }, {
      "duration": 0.1310040499999996,
      "durationTicks": 152,
      "midi": 82,
      "name": "A#5",
      "ticks": 5280,
      "time": 4.550667,
      "velocity": 0.7874015748031497
    }, {
      "duration": 0.1310040499999996,
      "durationTicks": 152,
      "midi": 82,
      "name": "A#5",
      "ticks": 5439,
      "time": 4.68770413125,
      "velocity": 0.7874015748031497
    }, {
      "duration": 0.1301421812500001,
      "durationTicks": 151,
      "midi": 82,
      "name": "A#5",
      "ticks": 5599,
      "time": 4.825603131249999,
      "velocity": 0.7874015748031497
    }, {
      "duration": 0.39301214999999967,
      "durationTicks": 456,
      "midi": 76,
      "name": "E5",
      "ticks": 5760,
      "time": 4.964364,
      "velocity": 0.7874015748031497
    }]
  }, {
    "channel": 0,
    "controlChanges": {
      "0": [{
        "number": 0,
        "ticks": 0,
        "time": 0,
        "value": 0
      }],
      "32": [{
        "number": 32,
        "ticks": 0,
        "time": 0,
        "value": 0
      }]
    },
    "pitchBends": [],
    "instrument": {
      "family": "piano",
      "number": 0,
      "name": "acoustic grand piano"
    },
    "name": "Sequenced By",
    "notes": [],
    "endOfTrackTicks": 7680
  }, {
    "channel": 1,
    "controlChanges": {},
    "pitchBends": [],
    "instrument": {
      "family": "reed",
      "number": 71,
      "name": "clarinet"
    },
    "name": "",
    "notes": [{
      "duration": 0.13100404999999998,
      "durationTicks": 152,
      "midi": 52,
      "name": "E3",
      "ticks": 160,
      "time": 0.137899,
      "velocity": 0.7086614173228346
    }, {
      "duration": 0.13100404999999998,
      "durationTicks": 152,
      "midi": 55,
      "name": "G3",
      "ticks": 320,
      "time": 0.275798,
      "velocity": 0.7086614173228346
    }, {
      "duration": 0.13100405000000004,
      "durationTicks": 152,
      "midi": 60,
      "name": "C4",
      "ticks": 480,
      "time": 0.413697,
      "velocity": 0.7086614173228346
    }, {
      "duration": 0.13100404999999993,
      "durationTicks": 152,
      "midi": 64,
      "name": "E4",
      "ticks": 640,
      "time": 0.551596,
      "velocity": 0.7086614173228346
    }, {
      "duration": 0.13100405000000004,
      "durationTicks": 152,
      "midi": 67,
      "name": "G4",
      "ticks": 800,
      "time": 0.689495,
      "velocity": 0.7086614173228346
    }, {
      "duration": 0.3930121500000001,
      "durationTicks": 456,
      "midi": 72,
      "name": "C5",
      "ticks": 960,
      "time": 0.827394,
      "velocity": 0.7086614173228346
    }, {
      "duration": 0.3930121500000001,
      "durationTicks": 456,
      "midi": 67,
      "name": "G4",
      "ticks": 1440,
      "time": 1.241091,
      "velocity": 0.7086614173228346
    }, {
      "duration": 0.13100405000000026,
      "durationTicks": 152,
      "midi": 51,
      "name": "D#3",
      "ticks": 2080,
      "time": 1.7926869999999997,
      "velocity": 0.7874015748031497
    }, {
      "duration": 0.13100404999999982,
      "durationTicks": 152,
      "midi": 56,
      "name": "G#3",
      "ticks": 2240,
      "time": 1.9305860000000001,
      "velocity": 0.7874015748031497
    }, {
      "duration": 0.13100405000000004,
      "durationTicks": 152,
      "midi": 60,
      "name": "C4",
      "ticks": 2400,
      "time": 2.068485,
      "velocity": 0.7874015748031497
    }, {
      "duration": 0.13100405000000004,
      "durationTicks": 152,
      "midi": 63,
      "name": "D#4",
      "ticks": 2560,
      "time": 2.206384,
      "velocity": 0.7874015748031497
    }, {
      "duration": 0.13100405000000004,
      "durationTicks": 152,
      "midi": 68,
      "name": "G#4",
      "ticks": 2720,
      "time": 2.344283,
      "velocity": 0.7874015748031497
    }, {
      "duration": 0.3930121500000001,
      "durationTicks": 456,
      "midi": 72,
      "name": "C5",
      "ticks": 2880,
      "time": 2.482182,
      "velocity": 0.7086614173228346
    }, {
      "duration": 0.3930121500000001,
      "durationTicks": 456,
      "midi": 68,
      "name": "G#4",
      "ticks": 3360,
      "time": 2.895879,
      "velocity": 0.7086614173228346
    }, {
      "duration": 0.1310040499999996,
      "durationTicks": 152,
      "midi": 53,
      "name": "F3",
      "ticks": 4000,
      "time": 3.4474750000000003,
      "velocity": 0.7874015748031497
    }, {
      "duration": 0.13100405000000004,
      "durationTicks": 152,
      "midi": 58,
      "name": "A#3",
      "ticks": 4160,
      "time": 3.5853739999999994,
      "velocity": 0.7874015748031497
    }, {
      "duration": 0.13100405000000004,
      "durationTicks": 152,
      "midi": 62,
      "name": "D4",
      "ticks": 4320,
      "time": 3.723273,
      "velocity": 0.7874015748031497
    }, {
      "duration": 0.1310040499999996,
      "durationTicks": 152,
      "midi": 65,
      "name": "F4",
      "ticks": 4480,
      "time": 3.8611720000000003,
      "velocity": 0.7874015748031497
    }, {
      "duration": 0.13100405000000004,
      "durationTicks": 152,
      "midi": 70,
      "name": "A#4",
      "ticks": 4640,
      "time": 3.9990709999999994,
      "velocity": 0.7874015748031497
    }, {
      "duration": 0.39301214999999967,
      "durationTicks": 456,
      "midi": 74,
      "name": "D5",
      "ticks": 4800,
      "time": 4.13697,
      "velocity": 0.7874015748031497
    }, {
      "duration": 0.39301214999999967,
      "durationTicks": 456,
      "midi": 74,
      "name": "D5",
      "ticks": 5280,
      "time": 4.550667,
      "velocity": 0.7874015748031497
    }, {
      "duration": 0.39301214999999967,
      "durationTicks": 456,
      "midi": 84,
      "name": "C6",
      "ticks": 5760,
      "time": 4.964364,
      "velocity": 0.7874015748031497
    }]
  }, {
    "channel": 0,
    "controlChanges": {
      "0": [{
        "number": 0,
        "ticks": 0,
        "time": 0,
        "value": 0
      }],
      "32": [{
        "number": 32,
        "ticks": 0,
        "time": 0,
        "value": 0
      }]
    },
    "pitchBends": [],
    "instrument": {
      "family": "piano",
      "number": 0,
      "name": "acoustic grand piano"
    },
    "name": "MIDI225368@aol.com",
    "notes": [],
    "endOfTrackTicks": 7680
  }, {
    "channel": 2,
    "controlChanges": {},
    "pitchBends": [],
    "instrument": {
      "family": "reed",
      "number": 71,
      "name": "clarinet"
    },
    "name": "",
    "notes": [{
      "duration": 0.13100405000000004,
      "durationTicks": 152,
      "midi": 48,
      "name": "C3",
      "ticks": 480,
      "time": 0.413697,
      "velocity": 0.7874015748031497
    }, {
      "duration": 0.13100404999999993,
      "durationTicks": 152,
      "midi": 52,
      "name": "E3",
      "ticks": 639,
      "time": 0.55073413125,
      "velocity": 0.7874015748031497
    }, {
      "duration": 0.1301421812500001,
      "durationTicks": 151,
      "midi": 55,
      "name": "G3",
      "ticks": 799,
      "time": 0.6886331312499999,
      "velocity": 0.7874015748031497
    }, {
      "duration": 0.3930121500000001,
      "durationTicks": 456,
      "midi": 64,
      "name": "E4",
      "ticks": 960,
      "time": 0.827394,
      "velocity": 0.7874015748031497
    }, {
      "duration": 0.3930121500000001,
      "durationTicks": 456,
      "midi": 60,
      "name": "C4",
      "ticks": 1440,
      "time": 1.241091,
      "velocity": 0.7874015748031497
    }, {
      "duration": 0.13100405000000004,
      "durationTicks": 152,
      "midi": 48,
      "name": "C3",
      "ticks": 2400,
      "time": 2.068485,
      "velocity": 0.7874015748031497
    }, {
      "duration": 0.1310040499999996,
      "durationTicks": 152,
      "midi": 51,
      "name": "D#3",
      "ticks": 2559,
      "time": 2.20552213125,
      "velocity": 0.7874015748031497
    }, {
      "duration": 0.1301421812500001,
      "durationTicks": 151,
      "midi": 56,
      "name": "G#3",
      "ticks": 2719,
      "time": 2.34342113125,
      "velocity": 0.7874015748031497
    }, {
      "duration": 0.3930121500000001,
      "durationTicks": 456,
      "midi": 63,
      "name": "D#4",
      "ticks": 2880,
      "time": 2.482182,
      "velocity": 0.7874015748031497
    }, {
      "duration": 0.3930121500000001,
      "durationTicks": 456,
      "midi": 60,
      "name": "C4",
      "ticks": 3360,
      "time": 2.895879,
      "velocity": 0.7874015748031497
    }, {
      "duration": 0.19650607499999984,
      "durationTicks": 228,
      "midi": 50,
      "name": "D3",
      "ticks": 4320,
      "time": 3.723273,
      "velocity": 0.7874015748031497
    }, {
      "duration": 0.1310040499999996,
      "durationTicks": 152,
      "midi": 53,
      "name": "F3",
      "ticks": 4479,
      "time": 3.8603101312500003,
      "velocity": 0.7874015748031497
    }, {
      "duration": 0.1301421812500001,
      "durationTicks": 151,
      "midi": 58,
      "name": "A#3",
      "ticks": 4639,
      "time": 3.9982091312499994,
      "velocity": 0.7874015748031497
    }, {
      "duration": 0.39301214999999967,
      "durationTicks": 456,
      "midi": 65,
      "name": "F4",
      "ticks": 4800,
      "time": 4.13697,
      "velocity": 0.7874015748031497
    }, {
      "duration": 0.1310040499999996,
      "durationTicks": 152,
      "midi": 62,
      "name": "D4",
      "ticks": 5280,
      "time": 4.550667,
      "velocity": 0.7874015748031497
    }, {
      "duration": 0.1310040499999996,
      "durationTicks": 152,
      "midi": 62,
      "name": "D4",
      "ticks": 5439,
      "time": 4.68770413125,
      "velocity": 0.7874015748031497
    }, {
      "duration": 0.1301421812500001,
      "durationTicks": 151,
      "midi": 62,
      "name": "D4",
      "ticks": 5599,
      "time": 4.825603131249999,
      "velocity": 0.7874015748031497
    }, {
      "duration": 0.39301214999999967,
      "durationTicks": 456,
      "midi": 60,
      "name": "C4",
      "ticks": 5760,
      "time": 4.964364,
      "velocity": 0.7874015748031497
    }]
  }]
};

},{}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var keyCodes = {
  "1m": {
    "keyName": "A Minor",
    "toneCode": "A4"
  },
  "2m": {
    "keyName": "E Minor",
    "toneCode": "E4"
  },
  "3m": {
    "keyName": "B Minor",
    "toneCode": "B4"
  },
  "4m": {
    "keyName": "F♯ Minor",
    "toneCode": "F#4"
  },
  "5m": {
    "keyName": "C♯ Minor",
    "toneCode": "C#4"
  },
  "6m": {
    "keyName": "G♯ Minor",
    "toneCode": "G#4"
  },
  "7m": {
    "keyName": "D♯ Minor",
    "toneCode": "D#4"
  },
  "8m": {
    "keyName": "A♯ Minor",
    "toneCode": "A#4"
  },
  "9m": {
    "keyName": "F Minor",
    "toneCode": "F4"
  },
  "10m": {
    "keyName": "C Minor",
    "toneCode": "C4"
  },
  "11m": {
    "keyName": "G Minor",
    "toneCode": "G4"
  },
  "12m": {
    "keyName": "D Minor",
    "toneCode": "D4"
  },
  "1d": {
    "keyName": "A Major",
    "toneCode": "A4"
  },
  "2d": {
    "keyName": "E Major",
    "toneCode": "E4"
  },
  "3d": {
    "keyName": "B Major",
    "toneCode": "B4"
  },
  "4d": {
    "keyName": "F♯ Major",
    "toneCode": "F#4"
  },
  "5d": {
    "keyName": "C♯ Major",
    "toneCode": "C#4"
  },
  "6d": {
    "keyName": "G♯ Major",
    "toneCode": "G#4"
  },
  "7d": {
    "keyName": "D♯ Major",
    "toneCode": "D#4"
  },
  "8d": {
    "keyName": "A♯ Major",
    "toneCode": "A#4"
  },
  "9d": {
    "keyName": "F Major",
    "toneCode": "F4"
  },
  "10d": {
    "keyName": "C Major",
    "toneCode": "C4"
  },
  "11d": {
    "keyName": "G Major",
    "toneCode": "G4"
  },
  "12d": {
    "keyName": "D Major",
    "toneCode": "D4"
  }
};
var _default = exports["default"] = keyCodes;

},{}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = harmonicShift;
function harmonicShift(traktorKeyCode) {
  var _this = this;
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
    type: 'perfectFifth'
  };
  var wheelOrder = ['1m', '2m', '3m', '4m', '5m', '6m', '7m', '8m', '9m', '10m', '11m', '12m', '1d', '2d', '3d', '4d', '5d', '6d', '7d', '8d', '9d', '10d', '11d', '12d'];
  var currentIndex = wheelOrder.indexOf(traktorKeyCode);
  if (currentIndex === -1) {
    // keycode wasn't found, try to find it in the toneCode property
    var keys = Object.keys(this.keyCodes);
    var foundKey = keys.find(function (key) {
      return _this.keyCodes[key].toneCode === traktorKeyCode;
    });
    if (foundKey) {
      currentIndex = wheelOrder.indexOf(foundKey);
    }
  }
  if (currentIndex === -1) {
    // throw new Error('Invalid Traktor Key Code');
    console.log("WARNING: Could not find Traktor Key Code", traktorKeyCode);
    return;
  }
  switch (options.type) {
    case 'perfectFifth':
      // 7 steps forward for major, 7 steps backward for minor
      currentIndex += traktorKeyCode.endsWith('m') ? -7 : 7;
      break;
    case 'majorMinorSwap':
      // Toggle between major and minor
      currentIndex += traktorKeyCode.endsWith('m') ? 12 : -12;
      break;
    case 'shift':
      // Shift by a specified amount
      if (typeof options.amount !== 'number' || Math.abs(options.amount) > 3) {
        throw new Error('Invalid shift amount');
      }
      currentIndex += options.amount;
      break;
    default:
      throw new Error('Invalid transition type');
  }

  // Ensure the index wraps around the wheel
  currentIndex = (currentIndex + 24) % 24;
  return wheelOrder[currentIndex];
}

/*
// Example usage
console.log(harmonicShift('5m', { type: 'perfectFifth' })); // Expected output: 10m
console.log(harmonicShift('5m', { type: 'majorMinorSwap' })); // Expected output: 5d
console.log(harmonicShift('5m', { type: 'shift', amount: -2 })); // Expected output: 3m
*/

},{}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = playIntroJingle;
function playIntroJingle(currentMidi) {
  var _this = this;
  var that = this;
  var synths = [];
  //let currentMidi = startUpJingle;
  var now = Tone.now() + 0.5;
  currentMidi.tracks.forEach(function (track) {
    //create a synth for each track
    _this.synth = new Tone.PolySynth(Tone.Synth, {
      envelope: {
        attack: 0.02,
        decay: 0.1,
        sustain: 0.3,
        release: 1
      }
    }).toDestination();
    synths.push(that.synth);
    //schedule all of the events
    // we have access to that.synth, can we listen for play note events?
    track.notes.forEach(function (note) {
      that.playNote(note.name, note.duration, note.time + now, note.velocity);
    });
  });
}

},{}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = playSpatialSound;
// Method to play spatial sound
// TODO: needs to use pool of synths, this creates too many synths
function playSpatialSound(particle, blackHole) {
  if (!this.toneStarted) {
    Tone.start();
    this.toneStarted = true;
  }

  // Calculate panning based on particle's position relative to black hole
  var gameWidth = this.game.width; // Use actual game width
  var xPosition = (particle.position.x - blackHole.position.x) / gameWidth;
  var panner = new Tone.Panner(xPosition).toDestination();

  // Calculate velocity factor
  var velocityMagnitude = Math.sqrt(Math.pow(particle.velocity.x, 2) + Math.pow(particle.velocity.y, 2));
  var maxVelocity = 10; // Replace with maximum expected velocity in your game
  var velocityFactor = velocityMagnitude / maxVelocity;

  // Create FM Synth for water drop sound
  var fmSynth = new Tone.FMSynth({
    harmonicity: 8,
    modulationIndex: 2,
    oscillator: {
      type: 'sine'
    },
    envelope: {
      attack: 0.01,
      decay: 0.2,
      sustain: 0,
      release: 0.1
    },
    modulation: {
      type: 'square'
    },
    modulationEnvelope: {
      attack: 0.01,
      decay: 0.2,
      sustain: 0,
      release: 0.1
    }
  }).connect(panner);

  // Adjust parameters based on velocity
  var duration = 0.2 + 0.3 * (1 - velocityFactor); // Shorter duration for faster particles
  var pitchDrop = velocityFactor * 24; // Higher drop for faster particles

  // Trigger the FM Synth with a pitch drop
  fmSynth.triggerAttack("C4", Tone.now());
  setTimeout(function () {
    fmSynth.setNote("C".concat(4 - pitchDrop), Tone.now());
    fmSynth.triggerRelease(Tone.now() + duration);
  }, 10);

  // Optionally: Add a delay for a more spacious effect
  // const feedbackDelay = new Tone.FeedbackDelay("8n", 0.5).toDestination();
  // fmSynth.connect(feedbackDelay);
}

},{}]},{},[1])(1)
});
