(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}(g.PLUGINS || (g.PLUGINS = {})).StarField = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var gameTick = 0;
var BabylonStarField = /*#__PURE__*/function () {
  function BabylonStarField() {
    var starCount = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 5000;
    var fieldSize = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 10000;
    _classCallCheck(this, BabylonStarField);
    this.id = BabylonStarField.id;
    this.starCount = starCount;
    this.fieldSize = fieldSize;
    this.particles = [];
  }
  _createClass(BabylonStarField, [{
    key: "init",
    value: function init(game, engine, scene) {
      this.scene = scene;
      this.camera = scene.cameras[0];
      this.initialize(); // TODO: rename
    }
  }, {
    key: "initialize",
    value: function initialize() {
      var _this = this;
      var self;
      if (typeof BABYLON === 'undefined' || typeof this.scene === 'undefined') {
        setTimeout(function () {
          self.initialize();
        }, 10);
        return;
      }
      var pcs = new BABYLON.PointsCloudSystem("pcs", 1, this.scene);
      this.pcs = pcs;
      pcs.addPoints(this.starCount, function (particle, i) {
        particle.position.x = Math.random() * _this.fieldSize - _this.fieldSize / 2;
        particle.position.y = Math.random() * _this.fieldSize - _this.fieldSize / 2;
        particle.position.z = Math.random() * _this.fieldSize - _this.fieldSize / 2;
      });
      pcs.buildMeshAsync().then(function () {
        _this.scene.clearColor = new BABYLON.Color4(0, 0, 0, 1);
      });
      this.particles = pcs.particles;
      this.scene.registerBeforeRender(function () {
        return _this.updateStars();
      });
    }
  }, {
    key: "updateStars",
    value: function updateStars() {
      var _this2 = this;
      if (!this.camera) {
        // if there is no camera, do not move the stars
        console.log('this.camera was not found in StarField.updateStars, returning early');
        return;
      }
      var halfFieldSize = this.fieldSize / 2;
      this.pcs.updateParticle = function (particle) {
        ['x', 'y', 'z'].forEach(function (axis) {
          if (particle.position[axis] - _this2.camera.position[axis] > halfFieldSize) {
            // Particle has exited positive side, reposition on negative side with buffer
            particle.position[axis] -= _this2.fieldSize - 10; // 10 units buffer to avoid sudden gaps
          } else if (particle.position[axis] - _this2.camera.position[axis] < -halfFieldSize) {
            // Particle has exited negative side, reposition on positive side with buffer
            particle.position[axis] += _this2.fieldSize - 10; // 10 units buffer to avoid sudden gaps
          }
        });

        return true; // Return true to update the particle in the system
      };

      this.pcs.setParticles();
    }
  }]);
  return BabylonStarField;
}();
_defineProperty(BabylonStarField, "id", 'babylon-starfield');
_defineProperty(BabylonStarField, "removable", false);
var _default = exports["default"] = BabylonStarField;

},{}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var CSSStarField = /*#__PURE__*/function () {
  function CSSStarField() {
    var starCount = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 100;
    var fieldWidth = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 800;
    var fieldHeight = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 600;
    _classCallCheck(this, CSSStarField);
    this.id = CSSStarField.id;
    this.starCount = starCount;
    this.fieldWidth = fieldWidth;
    this.fieldHeight = fieldHeight;
    this.particles = [];
  }
  _createClass(CSSStarField, [{
    key: "init",
    value: function init(game) {
      this.game = game;
      this.initialize();
    }
  }, {
    key: "initialize",
    value: function initialize() {
      this.generateStarfield();
    }
  }, {
    key: "generateStarfield",
    value: function generateStarfield() {
      var game = this.game;
      game.setBackground('black');

      /*
        this.game.createEntity({
          type: 'STARFIELD',
          body: false,
          // dark purple
          color: 0x110022,
          width: this.fieldWidth,
          height: this.fieldHeight,
          style: {
            backgroundColor: 'black',
            overflow: 'hidden',
            zIndex: -1
          },
          position: {
            x: 0,
            y: 0,
            z: -10
          }
        });
        */

      for (var i = 0; i < this.starCount; i++) {
        // Adjusting star positions to be relative to the center
        var posX = Math.random() * this.fieldWidth - this.fieldWidth / 2;
        var posY = Math.random() * this.fieldHeight - this.fieldHeight / 2;
        this.game.createEntity({
          type: 'STAR',
          collisionActive: false,
          collisionEnd: false,
          // body: false,
          isSensor: true,
          width: 4,
          height: 4,
          mass: 100,
          color: 0xffffff,
          style: {
            zIndex: 2,
            width: '2px',
            height: '2px',
            backgroundColor: 'white',
            borderRadius: '50%'
          },
          position: {
            x: posX,
            y: posY,
            z: -5
          }
        });
      }
    }
  }, {
    key: "update",
    value: function update(playerX, playerY) {
      // Update logic (if needed)
    }
  }]);
  return CSSStarField;
}();
_defineProperty(CSSStarField, "id", 'css-starfield');
_defineProperty(CSSStarField, "removable", false);
var _default = exports["default"] = CSSStarField;

},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _BabylonStarField = _interopRequireDefault(require("./BabylonStarField.js"));
var _CSSStarField = _interopRequireDefault(require("./CSSStarField.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); } // TODO: add starfields for other graphics engines
var StarField = /*#__PURE__*/function () {
  function StarField() {
    var starCount = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 5000;
    var fieldSize = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 10000;
    _classCallCheck(this, StarField);
    // TODO: pass this to individual graphics plugins as options
    this.id = StarField.id;
    this.starCount = starCount;
    this.fieldSize = fieldSize;
    this.particles = [];
  }
  _createClass(StarField, [{
    key: "init",
    value: function init(game, engine, scene) {
      this.game = game;
      this.engine = engine;
      this.scene = scene;
      function loadStarfields() {
        // for now, we will mutually exclusive lock starfield to one graphics engine
        // TODO: implement pattern for branching plugins that can delegate to other plugins
        // For example: game.use('StarField') -> game.use('BabylonStarField-') -> game.use('PhaserStarField')
        // This pattern will be useful for creating global high level APIs that can be implemented by multiple plugins
        if (game.graphics.length === 0) {
          console.log('no graphics plugins loaded, trying again');
          setTimeout(loadStarfields, 10);
          return;
        }
        game.graphics.forEach(function (graphicInterface) {
          if (graphicInterface.id === 'graphics-babylon') {
            // hard-code per graphics pipeline for now
            game.use(new _BabylonStarField["default"]());
          }
          // for now, current CSS StarField is fully intefactive
          // we'll need to optimize the CSS entity rendering just a bit for this to work 
          // more performantly with a large number of stars
          if (graphicInterface.id === 'graphics-css') {
            // hard-code per graphics pipeline for now
            game.use(new _CSSStarField["default"]());
          }
        });
      }
      loadStarfields();
    }
  }, {
    key: "unload",
    value: function unload() {
      // removes the babylon starfield from the scene
      /*
      game.graphics.forEach(function(graphicInterface){
        if (graphicInterface.id === 'graphics-babylon') { // hard-code per graphics pipeline for now
        }
      });
      */
    }
  }]);
  return StarField;
}();
_defineProperty(StarField, "id", 'starfield');
_defineProperty(StarField, "removable", false);
var _default = exports["default"] = StarField;

},{"./BabylonStarField.js":1,"./CSSStarField.js":2}]},{},[3])(3)
});
