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

    _this.socket.on('login_success', function (username) {
      _this.state.account.username = username;
      alert("Logged in as " + username);

      _this.updateState();
    });

    _this.socket.on('end_game_request', function (id) {
      //Cast your vote on wheter you think the game should end or not.
      var vote = confirm("Someone requested to end the game. Do you agree?");
      env.socket.emit('end_game_vote', vote);
    });

    _this.socket.on('bank_update', function (msg) {
      var data = JSON.parse(msg);
      var circ = data.circulation;
      var cs = data.currencySymbol;
      var supply = data.supply;
      env.state.bank.circulation = circ;
      env.state.bank.currencySymbol = cs;
      env.state.bank.supply = supply;
      env.updateState();
    });

    _this.socket.on('game_update', function (msg) {
      if (_this.state.account.username == undefined) return;
      var data = JSON.parse(msg);
      env.state.game.pool = data.pool;
      var previousMinBet = env.state.game.minBet;
      env.state.game.minBet = data.minBet;
      if (previousMinBet < env.state.game.minBet) env.state.game.hasToCall = true;
      env.updateState();
    });

    _this.socket.on('account_update', function (msg) {
      var data = JSON.parse(msg);
      env.state.account.balance = data.balance;
      env.state.account.debt = data.debt;
      env.state.account.profit = data.profit;
      env.updateState();
    });

    _this.socket.on('loan_rejected', function (amount) {
      alert("Your loan request of " + amount + " was rejected!");
    });

    _this.socket.on('game_contested', function () {
      alert("Contested game cannot be ended!");
    });

    _this.socket.on('logout_success', function () {
      _this.state = _this.props.initState;
      _this.state.accounts.username = undefined;

      _this.updateState();

      alert("Logged out successfully.");
    });

    _this.socket.on('fold_rejected', function (msg) {
      alert("Cannot fold! Reason: ".concat(msg));
    });

    _this.socket.on('bet_rejected', function (msg) {
      alert("Cannot place bet! Reason: ".concat(msg));
    });

    _this.socket.on('call_rejected', function (msg) {
      alert("Cannot call! Reason: ".concat(msg));
    });

    _this.updateState = _this.updateState.bind(_assertThisInitialized(_this));
    _this.placeBet = _this.placeBet.bind(_assertThisInitialized(_this));
    _this.loan = _this.loan.bind(_assertThisInitialized(_this));
    _this.payDebt = _this.payDebt.bind(_assertThisInitialized(_this));
    _this.endGame = _this.endGame.bind(_assertThisInitialized(_this));
    _this.createGame = _this.createGame.bind(_assertThisInitialized(_this));
    _this.fold = _this.fold.bind(_assertThisInitialized(_this));
    _this.connect = _this.connect.bind(_assertThisInitialized(_this));
    _this.disconnect = _this.disconnect.bind(_assertThisInitialized(_this));
    _this.call = _this.call.bind(_assertThisInitialized(_this));
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
      var input = prompt("Enter amount to bet:", this.state.game.minBet.toFixed(2) || 0.1);
      var amount = parseFloat(input);

      if (isNaN(amount)) {
        alert("Amount has to be a number!");
        return;
      }

      if (amount < this.state.game.minBet) {
        alert("You must bet more or equal to the minimum bet of " + this.state.game.minBet || 0.1);
        return;
      }

      if (amount > this.state.account.balance) {
        alert("You are trying to bet more than your balance!");
        return;
      }

      var sideSelector = document.querySelector("#input-game-bool");
      var side = sideSelector.value === "True";
      /*
      const answer = confirm("You are about to bet " + side + " for " + amount + " " + this.state.bank.currencySymbol + ". Are you sure?");
        if(answer == false) return;
      */

      var bet = {
        id: this.socket.id,
        amount: amount,
        side: side
      };
      var msg = {
        from: this.state.account.username,
        to: "server",
        data: bet
      };
      this.sendMessage('place_bet', msg);
    }
  }, {
    key: "fold",
    value: function fold() {
      var answer = confirm("Do you really want to fold?");
      if (answer == false) return;
      var msg = {
        from: this.state.account.username,
        to: "server",
        data: null
      };
      this.sendMessage('fold', msg);
    }
  }, {
    key: "call",
    value: function call() {
      var amount = this.state.game.minBet;
      var answer = confirm("Calling ".concat(amount, ", are you sure?"));
      if (answer == false) return;
      var bet = {
        amount: amount,
        side: -1,
        id: this.state.account.username
      };
      var msg = {
        from: this.state.account.username,
        to: "server",
        data: bet
      };
      this.sendMessage('call', msg);
    }
  }, {
    key: "payDebt",
    value: function payDebt() {
      var input = prompt("Enter amount to pay:", 1);
      var amount = parseFloat(input);

      if (isNaN(amount)) {
        alert("Amount has to be a number!");
        return;
      }

      ;

      if (amount > this.state.account.balance) {
        alert("Amount exceedes balance!");
        return;
      }

      if (amount > this.state.account.debt) {
        alert("Amount exceedes debt!");
        return;
      } //this.socket.emit('pay_debt', amount);


      var msg = {
        from: this.state.account.username,
        to: "server",
        data: amount
      };
      this.sendMessage('pay_debt', msg);
    }
  }, {
    key: "loan",
    value: function loan() {
      var input = prompt("Enter amount you want to loan:");
      var amount = parseFloat(input);

      if (isNaN(amount)) {
        alert("Amount has to be a number!");
        return;
      }

      ;
      var msg = {
        from: this.state.account.username,
        to: "server",
        data: amount
      };
      this.sendMessage('loan', msg);
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
      var msg = {
        from: this.state.account.username,
        to: "server",
        data: result
      };
      this.sendMessage('end_game_accepted', msg);
    }
  }, {
    key: "createGame",
    value: function createGame() {
      var name = prompt("Enter game name");
      var answer = confirm("Is this name ok?: \"" + name + '\"');
      if (answer == false) return;
      var msg = {
        from: this.state.account.username,
        to: "server",
        data: name
      };
      this.sendMessage('create-game', msg);
    }
  }, {
    key: "numberFormat",
    value: function numberFormat(number) {
      if (isNaN(number)) return number;
      /*Compresses big numbers, adds a letter postfix representation of the quantity of the number and returns it as a string */

      var thousand = 1000;
      var million = 1000000;
      var billion = 1000000000;
      var trillion = 1000000000000;
      var postfix = number >= trillion ? 'T' : number >= billion ? 'B' : number >= million ? 'M' : number >= thousand ? 'K' : "";
      var compressed = number >= trillion ? number / trillion : number >= billion ? number / billion : number >= million ? number / million : number >= thousand ? number / thousand : number;
      return compressed.toFixed(2) + postfix;
    }
  }, {
    key: "sendMessage",
    value: function sendMessage(type, msg) {
      this.socket.emit(type, JSON.stringify(msg));
    }
  }, {
    key: "connect",
    value: function connect() {
      if (this.state.account.username != undefined) return; //Stop user from sending login requests when they already are logged in.

      var input = document.querySelector("#input-username");
      var username = input.value;
      /*
      const answer = confirm("Are you sure you want to connect as \'" + username + "\'");
        if(answer == false) return;
      */
      //this.sendMessage('login', msg);

      var msg = {
        from: username,
        to: "server",
        data: null
      };
      this.sendMessage('login', msg);
    }
  }, {
    key: "disconnect",
    value: function disconnect() {
      var username = this.state.account.username;
      var msg = {
        from: username,
        to: "server",
        data: null
      };
      this.sendMessage('logout', msg);
    }
  }, {
    key: "render",
    value: function render() {
      var pool = this.state.game.pool;
      var balance = this.state.account.balance;
      var profit = this.state.account.profit;
      var debt = this.state.account.debt;
      var circulation = this.state.bank.circulation;
      var supply = this.state.bank.supply;
      var poolRenderAmount = this.numberFormat(pool);
      var accountBalanceRenderAmount = this.numberFormat(balance);
      var profitRenderAmount = this.numberFormat(profit);
      var debtRenderAmount = this.numberFormat(debt);
      var circulationRenderAmount = this.numberFormat(circulation);
      var supplyRenderAmount = this.numberFormat(supply);
      return /*#__PURE__*/React.createElement("div", {
        id: "app-content"
      }, /*#__PURE__*/React.createElement(GameName, {
        gameName: this.state.game.name
      }), /*#__PURE__*/React.createElement(GamePool, {
        pool: poolRenderAmount,
        minBet: this.state.game.minBet,
        currencySymbol: this.state.bank.currencySymbol
      }), /*#__PURE__*/React.createElement(BankGrid, {
        circulation: circulationRenderAmount,
        currencySymbol: this.state.bank.currencySymbol,
        supply: supplyRenderAmount
      }), /*#__PURE__*/React.createElement(AccountGrid, {
        balance: accountBalanceRenderAmount,
        debt: debtRenderAmount,
        currencySymbol: "mk",
        profit: profitRenderAmount
      }), /*#__PURE__*/React.createElement(ControlGrid, {
        payDebtFunction: this.payDebt,
        loanFunction: this.loan,
        placeBetFunction: this.placeBet,
        endGameFunction: this.endGame,
        createGameFunction: this.createGame,
        foldFunction: this.fold,
        callFunction: this.call,
        minBet: this.state.game.minBet,
        hasToCall: false
      }), /*#__PURE__*/React.createElement(LoginGrid, {
        connectFunction: this.connect,
        disconnectFunction: this.disconnect,
        username: this.state.account.username
      }));
    }
  }]);

  return App;
}(React.Component);