"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var ControlGrid = /*#__PURE__*/function (_React$Component) {
  _inherits(ControlGrid, _React$Component);

  var _super = _createSuper(ControlGrid);

  function ControlGrid(props) {
    _classCallCheck(this, ControlGrid);

    return _super.call(this, props);
  }

  _createClass(ControlGrid, [{
    key: "render",
    value: function render() {
      return /*#__PURE__*/React.createElement("div", {
        id: "grid-controls",
        className: "grid-item"
      }, /*#__PURE__*/React.createElement("button", {
        className: "control-button",
        id: "button-place-bet",
        onClick: this.props.betFunction
      }, this.props.mustCall ? this.props.lang == 'fin' ? "Vastaa" : "Call" : this.props.lang == 'fin' ? "Veikkaa" : "Place Bet"), /*#__PURE__*/React.createElement("select", {
        className: "control-button",
        id: "input-game-bool"
      }, /*#__PURE__*/React.createElement("option", null, "True"), /*#__PURE__*/React.createElement("option", null, "False")), /*#__PURE__*/React.createElement("button", {
        className: "control-button",
        id: "button-fold",
        onClick: this.props.foldFunction
      }, this.props.lang == 'fin' ? 'Luovuta' : 'Fold'), /*#__PURE__*/React.createElement("button", {
        className: "control-button",
        id: "button-end-game",
        onClick: this.props.endGameFunction
      }, this.props.lang == 'fin' ? 'Lopeta Peli' : 'End Game'), /*#__PURE__*/React.createElement("button", {
        className: "control-button",
        id: "button-pay-debt",
        onClick: this.props.payDebtFunction
      }, this.props.lang == 'fin' ? 'Maksa Velka' : 'Pay Debt'), /*#__PURE__*/React.createElement("button", {
        className: "control-button",
        id: "button-loan",
        onClick: this.props.loanFunction
      }, this.props.lang == 'fin' ? 'Lainaa' : 'Loan'));
    }
  }]);

  return ControlGrid;
}(React.Component);