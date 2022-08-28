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

var NewGame = /*#__PURE__*/function (_React$Component) {
  _inherits(NewGame, _React$Component);

  var _super = _createSuper(NewGame);

  function NewGame(props) {
    var _this;

    _classCallCheck(this, NewGame);

    _this = _super.call(this, props);
    _this.state = {
      loading: false,
      success: false
    };
    _this.success = _this.success.bind(_assertThisInitialized(_this));
    _this.failure = _this.failure.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(NewGame, [{
    key: "success",
    value: function success() {
      return /*#__PURE__*/React.createElement("h1", null, "Game creation success!");
    }
  }, {
    key: "failure",
    value: function failure() {
      return /*#__PURE__*/React.createElement("h1", null, "Game creation failure!");
    }
  }, {
    key: "render",
    value: function render() {
      if (this.props.user === undefined) {
        return /*#__PURE__*/React.createElement(Forbidden, null);
      } else {
        var ring = this.state.loading ? /*#__PURE__*/React.createElement(LoadingRing, null) : /*#__PURE__*/React.createElement(React.Fragment, null);
        return /*#__PURE__*/React.createElement("div", {
          className: "page",
          id: "new-game-page"
        }, /*#__PURE__*/React.createElement("h1", null, "Create new Game"), /*#__PURE__*/React.createElement("form", {
          id: "new-game-form"
        }, /*#__PURE__*/React.createElement("input", {
          name: "title",
          placeholder: "Enter game title",
          required: true,
          maxLength: 50
        }), /*#__PURE__*/React.createElement("input", {
          name: "minimumBet",
          type: "number",
          min: "0.01",
          step: "0.01",
          placeholder: "Enter minimum bet",
          required: true
        }), /*#__PURE__*/React.createElement("input", {
          name: "increment",
          type: "number",
          min: "0.01",
          step: "0.01",
          defaultValue: 0.01,
          placeholder: "Bet Increment"
        }), /*#__PURE__*/React.createElement("input", {
          name: "expiryDate",
          type: "date",
          placeholder: "Enter expiry date"
        }), /*#__PURE__*/React.createElement("button", {
          type: "submit"
        }, "Create")), ring);
      }
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      if (this.props.user) {
        var form = document.querySelector('#new-game-form');
        form.addEventListener('submit', function (e) {
          e.preventDefault();
          var game = {
            game_title: form.title.value,
            minimum_bet: form.minimumBet.value,
            expiry_date: form.expiryDate.value,
            increment: form.increment.value,
            created_by: _this2.props.user.username
          };

          _this2.props.newGameFunction(game);
        });
      }
    }
  }]);

  return NewGame;
}(React.Component);