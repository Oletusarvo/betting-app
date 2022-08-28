"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var Games = /*#__PURE__*/function (_React$Component) {
  _inherits(Games, _React$Component);

  var _super = _createSuper(Games);

  function Games(props) {
    var _this;

    _classCallCheck(this, Games);

    _this = _super.call(this, props);
    _this.state = {
      gamelist: [],
      loading: true,
      selectedGame: undefined
    };
    _this.selectGameFunction = _this.selectGameFunction.bind(_assertThisInitialized(_this));
    _this.bettingReturnFunction = _this.bettingReturnFunction.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(Games, [{
    key: "selectGameFunction",
    value: function selectGameFunction(game) {
      this.state.selectedGame = game;
      this.setState(this.state);
    }
  }, {
    key: "bettingReturnFunction",
    value: function bettingReturnFunction() {
      this.state.selectedGame = undefined;
      this.setState(this.state);
    }
  }, {
    key: "render",
    value: function render() {
      if (this.state.selectedGame !== undefined) {
        return /*#__PURE__*/React.createElement(Betting, {
          selectedGame: this.state.selectedGame,
          bettingReturnFunction: this.bettingReturnFunction
        });
      } else if (this.props.user === undefined) {
        return /*#__PURE__*/React.createElement(Forbidden, null);
      } else {
        return /*#__PURE__*/React.createElement(GameList, {
          gamelist: this.state.gamelist,
          loading: this.state.loading,
          selectGameFunction: this.selectGameFunction,
          title: "All Bets",
          user: this.props.user
        });
      }
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      if (this.state.gamelist.length == 0 || this.state.selectedGame === undefined) {
        var req = new XMLHttpRequest();
        req.open('GET', '/gamelist', true);
        var payload = {
          token: this.props.token
        };
        req.setRequestHeader('Content-Type', 'application/json');
        req.setRequestHeader('auth', this.props.token);
        req.send(JSON.stringify(payload));

        req.onload = function () {
          if (req.status === 200) {
            var gamelist = JSON.parse(req.response);
            _this2.state.gamelist = gamelist;
          }

          _this2.state.loading = false;

          _this2.setState(_this2.state);
        };
      }
    }
  }]);

  return Games;
}(React.Component);