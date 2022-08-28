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

var GameList = /*#__PURE__*/function (_React$Component) {
  _inherits(GameList, _React$Component);

  var _super = _createSuper(GameList);

  function GameList(props) {
    _classCallCheck(this, GameList);

    return _super.call(this, props);
  }

  _createClass(GameList, [{
    key: "render",
    value: function render() {
      var _this = this;

      var _final = [];
      this.props.gamelist.forEach(function (item) {
        var elem = /*#__PURE__*/React.createElement("div", {
          className: "game-list-entry container",
          key: item.game_id,
          onClick: function onClick() {
            return _this.props.selectGameFunction ? _this.props.selectGameFunction(item) : {};
          }
        }, /*#__PURE__*/React.createElement("table", null, /*#__PURE__*/React.createElement("tbody", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, "Title:"), /*#__PURE__*/React.createElement("td", {
          className: "align-right"
        }, item.game_title)), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, "Minumum Bet:"), /*#__PURE__*/React.createElement("td", {
          className: "align-right"
        }, "$", item.minimum_bet)), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, "Increment:"), /*#__PURE__*/React.createElement("td", {
          className: "align-right"
        }, "$", item.increment)), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, "Pool:"), /*#__PURE__*/React.createElement("td", {
          className: "align-right"
        }, "$", item.pool)), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, "Created By:"), /*#__PURE__*/React.createElement("td", {
          className: "align-right"
        }, item.created_by)), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, "Expires In:"), /*#__PURE__*/React.createElement("td", {
          className: "align-right"
        }, item.expiry_date)))), _this.props.deleteEnabled && (item.expiry_date == 'When Closed' || new Date().getMilliseconds() >= new Date(item.expiry_date).getMilliseconds()) ? /*#__PURE__*/React.createElement("button", {
          onClick: function onClick() {
            return _this.props.gameCloseFunction(item.game_id);
          }
        }, "Close") : /*#__PURE__*/React.createElement(React.Fragment, null));

        _final.push(elem);
      });

      if (this.props.loading) {
        return /*#__PURE__*/React.createElement(Loading, {
          title: "Loading bet list..."
        });
      } else {
        return /*#__PURE__*/React.createElement("div", {
          className: "page",
          id: "games-page"
        }, /*#__PURE__*/React.createElement("h1", null, this.props.title), _final.length > 0 ? _final : /*#__PURE__*/React.createElement("h1", null, "No games were loaded. Please try again later."));
      }
    }
  }]);

  return GameList;
}(React.Component);