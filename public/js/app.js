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

var App = /*#__PURE__*/function (_React$Component) {
  _inherits(App, _React$Component);

  var _super = _createSuper(App);

  function App(props) {
    var _this;

    _classCallCheck(this, App);

    _this = _super.call(this, props);
    _this.state = {
      currentSelection: 'home',
      user: localStorage.getItem('user') || undefined,
      token: localStorage.getItem('token') || '',
      action: 'none'
    };
    _this.signupFunction = _this.signupFunction.bind(_assertThisInitialized(_this));
    _this.loginFunction = _this.loginFunction.bind(_assertThisInitialized(_this));
    _this.bettingBackButtonFunction = _this.bettingBackButtonFunction.bind(_assertThisInitialized(_this));
    _this.gameCloseFunction = _this.gameCloseFunction.bind(_assertThisInitialized(_this));
    _this.newGameFunction = _this.newGameFunction.bind(_assertThisInitialized(_this));
    _this.logoutFunction = _this.logoutFunction.bind(_assertThisInitialized(_this));
    _this.navigate = _this.navigate.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(App, [{
    key: "signupFunction",
    value: function signupFunction(data) {
      var _this2 = this;

      this.state.action = 'signup';
      this.setState(this.state, function () {
        var req = new XMLHttpRequest();
        req.open('POST', '/signup', true);
        req.setRequestHeader('Content-Type', 'application/json');
        req.send(JSON.stringify(data));

        req.onload = function () {
          if (req.status === 200) {
            _this2.state.action = 'none';

            _this2.setState(_this2.state);
          }
        };
      });
    }
  }, {
    key: "loginFunction",
    value: function loginFunction(data) {
      var _this3 = this;

      //LOGIN
      this.state.action = 'login';
      this.setState(this.state, function () {
        var req = new XMLHttpRequest();
        req.open('POST', '/login', true);
        req.setRequestHeader('Content-Type', 'application/json');
        req.send(JSON.stringify(data));

        req.onload = function () {
          if (req.status == 200) {
            var payload = JSON.parse(req.response);
            _this3.state.user = payload.user;
            _this3.state.token = payload.token;
            _this3.state.action = 'none';
            localStorage.setItem('token', _this3.state.token);
            localStorage.setItem('user', _this3.state.user);

            _this3.setState(_this3.state);
          }
        };
      });
    }
  }, {
    key: "logoutFunction",
    value: function logoutFunction() {
      var _this4 = this;

      this.state.action = 'logout';
      this.setState(this.state, function () {
        _this4.state.currentSelection = 'home';
        _this4.state.user = undefined;
        _this4.state.token = '';
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        _this4.state.action = 'none';

        _this4.setState(_this4.state);
      });
    }
  }, {
    key: "bettingBackButtonFunction",
    value: function bettingBackButtonFunction() {
      this.state.selectedGame;
    }
  }, {
    key: "gameCloseFunction",
    value: function gameCloseFunction(id) {
      var _this5 = this;

      this.state.action = 'delete';
      this.setState(this.state, function () {
        var req = new XMLHttpRequest();
        req.open('DELETE', '/gamelist', true);
        req.setRequestHeader('Content-Type', 'application/json');
        req.setRequestHeader('auth', _this5.state.token);
        var data = {
          id: id
        };
        req.send(JSON.stringify(data));

        req.onload = function () {
          if (req.status == 200) {
            _this5.state.action = 'none';

            _this5.setState(_this5.state);
          }
        };
      });
    }
  }, {
    key: "newGameFunction",
    value: function newGameFunction(game) {
      var _this6 = this;

      this.state.action = 'newgame';
      this.setState(this.state, function () {
        var req = new XMLHttpRequest();
        req.open('POST', '/gamelist', true);
        req.setRequestHeader('Content-Type', 'application/json');
        req.setRequestHeader('auth', _this6.state.token);
        req.send(JSON.stringify(game));

        req.onload = function () {
          if (req.status == 200) {
            _this6.state.currentSelection = 'games';
            _this6.state.action = 'none';

            _this6.setState(_this6.state);
          }
        };
      });
    }
  }, {
    key: "navigate",
    value: function navigate(target) {
      this.state.currentSelection = target;
      this.setState(this.state);
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/React.createElement("div", {
        id: "app"
      }, /*#__PURE__*/React.createElement(Header, {
        user: this.state.user,
        logoutFunction: this.logoutFunction,
        currentSelection: this.state.currentSelection
      }), this.state.action === 'login' ? /*#__PURE__*/React.createElement(Loading, {
        title: "Logging In..."
      }) : this.state.action === 'logout' ? /*#__PURE__*/React.createElement(Loading, {
        title: "Logging Out..."
      }) : this.state.action === 'newgame' ? /*#__PURE__*/React.createElement(Loading, {
        title: "Creating Bet..."
      }) : this.state.action === 'signup' ? /*#__PURE__*/React.createElement(Loading, {
        title: "Signing up..."
      }) : this.state.action === 'delete' ? /*#__PURE__*/React.createElement(Loading, {
        title: "Deleting bet..."
      }) : /*#__PURE__*/React.createElement(Content, {
        currentSelection: this.state.currentSelection,
        user: this.state.user,
        token: this.state.token,
        loginFunction: this.loginFunction,
        signupFunction: this.signupFunction,
        bettingBackButtonFunction: this.bettingBackButtonFunction,
        gameCloseFunction: this.gameCloseFunction,
        newGameFunction: this.newGameFunction
      }), /*#__PURE__*/React.createElement(Navbar, {
        user: this.state.user,
        navigateFunction: this.navigate
      }));
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this7 = this;

      var logoutLink = document.querySelector('#logout-link');

      if (logoutLink) {
        logoutLink.addEventListener('click', function () {
          _this7.state.selected = 'login';
        });
      }
    }
  }]);

  return App;
}(React.Component);

ReactDOM.render( /*#__PURE__*/React.createElement(App, null), document.getElementById('root'));