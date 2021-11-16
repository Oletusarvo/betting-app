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

var App = /*#__PURE__*/function (_React$Component) {
  _inherits(App, _React$Component);

  var _super = _createSuper(App);

  function App(props) {
    var _this;

    _classCallCheck(this, App);

    _this = _super.call(this, props);
    _this.socket = io();
    _this.state = props.state;

    var env = _assertThisInitialized(_this);

    _this.socket.on('bank_update', function (msg) {
      var data = JSON.parse(msg);
      var circ = data.circulation;
      var cs = data.currencySymbol;
      env.state.bank.circulation = circ;
      env.state.bank.currencySymbol = cs;
      env.updateState();
    });

    _this.socket.on('game_update', function (msg) {
      var data = JSON.parse(msg);
      env.state.game.pool = data.pool;
      var previousMinBet = env.state.game.minBet;
      env.state.game.minBet = data.minBet;
      if (previousMinBet < env.state.game.minBet) _this.state.game.hasToCall = true;
      env.updateState();
    });

    _this.socket.on('account_update', function (msg) {
      var data = JSON.parse(msg);
      env.state.account.balance = data.balance;
      env.state.account.debt = data.debt;
      env.state.account.profit = data.profit;
      env.updateState();
    });

    _this.updateState = _this.updateState.bind(_assertThisInitialized(_this));
    _this.placeBet = _this.placeBet.bind(_assertThisInitialized(_this));
    _this.loan = _this.loan.bind(_assertThisInitialized(_this));
    _this.payDebt = _this.payDebt.bind(_assertThisInitialized(_this));
    _this.endGame = _this.endGame.bind(_assertThisInitialized(_this));
    _this.createGame = _this.createGame.bind(_assertThisInitialized(_this));
    _this.fold = _this.fold.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(App, [{
    key: "updateState",
    value: function updateState() {
      this.setState(this.state);
    }
  }, {
    key: "placeBet",
    value: function placeBet() {
      var input = document.querySelector("#input-bet-amount");
      var amount = parseFloat(input.value);
      if (typeof amount !== "number") return;

      if (amount < this.state.game.minBet) {
        //Flash the game pool ring as red.
        //const gamePoolRingElement = document.querySelector("#game-pool-border-circle");
        //gamePoolRingElement.classList.add("flash");
        return;
      }

      if (amount > this.state.account.balance) {
        //Flash the account balance output as red.
        //const accountBalanceOutput = document.querySelector("#output-account-balance");
        //accountBalanceOutput.classList.add("flash");
        //Use timer to turn the color back to white.
        return;
      }

      var answer = confirm("You are about to place a bet for " + amount + " " + this.state.bank.currencySymbol + ". Are you sure?");
      if (answer == false) return;
      var sideSelector = document.querySelector("#input-game-bool");
      var side = sideSelector.value === "True";
      var bet = {
        id: this.socket.id,
        amount: amount,
        side: side
      };
      this.socket.emit('place_bet', JSON.stringify(bet));
    }
  }, {
    key: "fold",
    value: function fold() {
      var answer = confirm("Do you really want to fold?");
      if (answer == false) return;
      this.socket.emit('fold', this.socket.id);
      this.state.game.folded = true;
    }
  }, {
    key: "call",
    value: function call() {
      var amount = this.state.game.minBet;
      var answer = confirm("Calling " + amount + ". Are you sure?");
      if (answer == false) return;
      this.socket.emit('place_bet', JSON.stringify({
        amount: amount,
        side: -1,
        //Bet side cannot be changed when there is already a bet out.
        id: this.socket.id
      }));
    }
  }, {
    key: "payDebt",
    value: function payDebt() {
      var input = document.querySelector("#input-bank");
      var amount = parseFloat(input.value);
      if (typeof amount !== "number") return;
      if (amount > this.state.account.balance) return;
      if (amount > this.state.account.debt) return;
      this.socket.emit('pay_debt', amount);
    }
  }, {
    key: "loan",
    value: function loan() {
      var input = document.querySelector("#input-bank");
      var amount = parseFloat(input.value);
      if (typeof amount !== "number") return;
      this.socket.emit('loan', amount);
    }
  }, {
    key: "resetGame",
    value: function resetGame() {
      this.state.game.pool = 0;
      this.state.game.minBet = 0.01;
    }
  }, {
    key: "endGame",
    value: function endGame() {
      var sideSelector = document.querySelector("#input-game-bool");
      var result = sideSelector.value === "True";
      this.socket.emit('end_game', result);
    }
  }, {
    key: "createGame",
    value: function createGame() {
      var name = prompt("Enter game name");
      var answer = confirm("Is this name ok?: \"" + name + '\"');
      if (answer == false) return;
      this.socket.emit('create-game', name);
    }
  }, {
    key: "render",
    value: function render() {
      var pool = this.state.game.pool;
      var poolRenderAmount = pool >= 1000000 ? (pool / 1000000).toFixed(2) + "m" : pool >= 1000 ? (pool / 1000).toFixed(2) + "k" : pool.toFixed(2);
      return /*#__PURE__*/React.createElement("div", {
        id: "app-content"
      }, /*#__PURE__*/React.createElement(GameGrid, {
        pool: poolRenderAmount,
        minBet: this.state.game.minBet,
        gameName: this.state.game.name,
        currencySymbol: "mk"
      }), /*#__PURE__*/React.createElement(BankGrid, {
        circulation: this.state.bank.circulation,
        currencySymbol: this.state.bank.currencySymbol
      }), /*#__PURE__*/React.createElement(AccountGrid, {
        balance: this.state.account.balance,
        debt: this.state.account.debt,
        currencySymbol: "mk",
        profit: this.state.account.profit
      }), /*#__PURE__*/React.createElement(ControlGrid, {
        payDebtFunction: this.payDebt,
        loanFunction: this.loan,
        placeBetFunction: this.placeBet,
        endGameFunction: this.endGame,
        createGameFunction: this.createGame,
        foldFunction: this.fold,
        callFunction: this.call,
        minBet: this.state.game.minBet,
        hasToCall: this.state.game.hasToCall
      }));
    }
  }]);

  return App;
}(React.Component);