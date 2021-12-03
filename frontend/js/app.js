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

    _this.socket.on('query_username', function () {
      var msg = {
        from: _this.state.accountUsername,
        to: 'server',
        data: null
      };

      _this.socket.emit('username', JSON.stringify(msg));
    });

    _this.socket.on('login_success', function (username) {
      _this.state.accountUsername = username;
      _this.state.canBet = true;
      alert("Logged in as " + username);

      _this.updateState();
    });

    _this.socket.on('end_game_request', function (result) {
      //Cast your vote on wheter you think the game should end or not.
      var vote = confirm("A request to end the game with result '".concat(result, "' has been placed. Do you agree?"));
      _this.state.canBet = false; //Until game either ends or the vote is rejected.

      var data = {
        from: env.state.accountUsername,
        to: 'server',
        data: {
          vote: vote,
          result: result
        }
      };
      env.socket.emit('end_game_vote', JSON.stringify(data));

      _this.updateState();
    });

    _this.socket.on('bank_update', function (msg) {
      var data = JSON.parse(msg);
      var circ = data.circulation;
      var cs = data.currencySymbol;
      var supply = data.supply;
      env.state.bankCirculation = circ;
      env.state.bankCurrencySymbol = cs;
      env.state.bankSupply = supply;
      env.updateState();
    });

    _this.socket.on('game_update', function (msg) {
      if (_this.state.accountUsername == undefined) {
        console.log('Undefined username, returning.');
        return;
      }

      var data = JSON.parse(msg);
      env.state.gamePool = data.pool;
      env.state.gameMinBet = data.minBet;
      env.state.gameName = data.gameName;
      env.updateState();
    });

    _this.socket.on('account_update', function (msg) {
      var data = JSON.parse(msg);
      env.state.accountBalance = data.balance;
      env.state.accountDebt = data.debt;
      env.state.accountProfit = data.profit;
      env.updateState();
    });

    _this.socket.on('loan_rejected', function (msg) {
      alert("Your loan request was rejected! Reason: ".concat(msg));
    });

    _this.socket.on('game_contested', function () {
      alert("Contested game cannot be ended!");
    });

    _this.socket.on('logout_success', function () {
      _this.state = _this.props.initState;
      _this.state.accountsUsername = undefined;

      _this.updateState();

      alert("Logged out successfully.");
    });

    _this.socket.on('fold_rejected', function (msg) {
      alert("Cannot fold! Reason: ".concat(msg));
    });

    _this.socket.on('fold_accepted', function () {
      _this.state.canBet = _this.state.mustCall = false;

      _this.updateState();
    });

    _this.socket.on('bet_rejected', function (msg) {
      alert("Cannot place bet! Reason: ".concat(msg));
    });

    _this.socket.on('bet_accepted', function (amount) {
      env.state.myBet = amount;
      env.state.participating = true;
      env.state.canBet = false;

      _this.updateState();
    });

    _this.socket.on('call_rejected', function (msg) {
      alert("Cannot call! Reason: ".concat(msg));
    });

    _this.socket.on('call_accepted', function () {
      _this.state.mustCall = false;

      _this.updateState();
    });

    _this.socket.on('general_error', function (msg) {
      alert("".concat(msg));
    });

    _this.socket.on('login_rejected', function (msg) {
      alert("Login was rejected! Reason: ".concat(msg));
    });

    _this.socket.on('game_ended', function () {
      //alert('The game has been ended!');
      env.state.canBet = true;
      env.state.participating = false;
      env.state.mustCall = false;
      env.state.myBet = undefined;
      env.state.folded = undefined;

      _this.updateState();
    });

    _this.socket.on('end_game_rejected', function (msg) {
      alert("Game cannot be ended! Reason: ".concat(msg));
      env.state.canBet = true;

      _this.updateState();
    });

    _this.socket.on('game_raised', function (amount) {
      _this.state.mustCall = _this.state.myBet ? true : false; //Causes problems if user has a bet out and disconnects in-between.

      _this.updateState();
    });

    _this.socket.on('account_accepted', function (msg) {
      alert('Account accepted!');
      _this.state.canBet = true;

      _this.updateState();
    });

    _this.socket.on('account_rejected', function (msg) {
      alert("Account rejected! Reason: ".concat(msg));
    });

    _this.updateState = _this.updateState.bind(_assertThisInitialized(_this));
    _this.placeBet = _this.placeBet.bind(_assertThisInitialized(_this));
    _this.loan = _this.loan.bind(_assertThisInitialized(_this));
    _this.payDebt = _this.payDebt.bind(_assertThisInitialized(_this));
    _this.endGame = _this.endGame.bind(_assertThisInitialized(_this));
    _this.fold = _this.fold.bind(_assertThisInitialized(_this));
    _this.fetchData = _this.fetchData.bind(_assertThisInitialized(_this));
    _this.disconnect = _this.disconnect.bind(_assertThisInitialized(_this));
    _this.call = _this.call.bind(_assertThisInitialized(_this));
    _this.setGameName = _this.setGameName.bind(_assertThisInitialized(_this));
    _this.createAccount = _this.createAccount.bind(_assertThisInitialized(_this));
    _this.dialog = _this.dialog.bind(_assertThisInitialized(_this));
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
      if (this.state.canBet == false) {
        alert('You can not bet at this moment!');
        return;
      }

      var input = prompt("Enter amount to bet:", this.state.gameMinBet.toFixed(2) || 0.1);
      var amount = parseFloat(input);

      if (isNaN(amount)) {
        alert("Amount has to be a number!");
        return;
      }

      if (amount == 0) {
        alert('Amount cannot be 0!');
        return;
      }

      var sideSelector = document.querySelector("#input-game-bool");
      var side = sideSelector.value === "True";
      var bet = {
        id: this.socket.id,
        amount: amount,
        side: side
      };
      var msg = {
        from: this.state.accountUsername,
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
        from: this.state.accountUsername,
        to: "server",
        data: null
      };
      this.sendMessage('fold', msg);
    }
  }, {
    key: "call",
    value: function call() {
      var minimum = this.state.gameMinBet;
      var myBet = this.state.myBet;
      var callAmount = !isNaN(myBet) ? minimum - myBet : minimum;
      var answer = confirm("Calling ".concat(callAmount, ", are you sure?"));
      if (answer == false) return;
      var bet = {
        amount: callAmount,
        side: -1,
        id: this.state.accountUsername
      };
      var msg = {
        from: this.state.accountUsername,
        to: "server",
        data: bet
      };
      this.sendMessage('call_bet', msg);
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

      ; //this.socket.emit('pay_debt', amount);

      var msg = {
        from: this.state.accountUsername,
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
        from: this.state.accountUsername,
        to: "server",
        data: amount
      };
      this.sendMessage('loan', msg);
    }
  }, {
    key: "resetGame",
    value: function resetGame() {
      this.state.gamePool = 0;
      this.state.gameMinBet = 0.01;
    }
  }, {
    key: "endGame",
    value: function endGame() {
      /*
      if(this.state.participating == false){
          alert('You can not end the game as you are not participating in it!');
          return;
      }
      */
      var sideSelector = document.querySelector("#input-game-bool");
      var result = sideSelector.value === "True"; //What if somebody else already did this?

      var answer = confirm("You are about to request to end the game with result '".concat(result, "'. Are you sure?"));
      if (answer == false) return;
      var msg = {
        from: this.state.accountUsername,
        to: "server",
        data: result
      };
      this.sendMessage('end_game_bypass', msg);
    }
  }, {
    key: "setGameName",
    value: function setGameName() {
      var gameName = prompt("Enter game name");

      if (gameName == "") {
        alert('Game name cannot be empty!');
        return;
      }

      var answer = confirm("Is this name ok?: \"" + gameName + '\"');
      if (answer == false) return;
      var msg = {
        from: this.state.accountUsername,
        to: "server",
        data: gameName
      };
      this.sendMessage('set_game_name', msg);
    }
  }, {
    key: "formatNumber",
    value: function formatNumber(number) {
      if (isNaN(number)) return undefined;
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
    key: "fetchData",
    value: function fetchData() {
      //TODO: change this to a post method.
      var inputUsername = document.querySelector("#input-username");
      var inputPassword = document.querySelector('#input-password');
      var username = inputUsername.value;
      var password = inputPassword.value;
      var msg = {
        from: username,
        to: "server",
        data: password
      };
      this.sendMessage('fetch_data', msg);
    }
  }, {
    key: "createAccount",
    value: function createAccount() {
      var inputUsername = document.querySelector("#input-username");
      var inputPassword = document.querySelector('#input-password');
      var username = inputUsername.value;
      var password = inputPassword.value;
      var answer = confirm("About to create account with username ".concat(username, ". Are you sure?"));
      if (answer == false) return;
      var msg = {
        from: undefined,
        to: "server",
        data: {
          username: username,
          password: password
        }
      };
      this.sendMessage('create_account', msg);
    }
  }, {
    key: "disconnect",
    value: function disconnect() {
      var username = this.state.accountUsername;
      var msg = {
        from: username,
        to: "server",
        data: null
      };
      this.sendMessage('logout', msg);
    }
  }, {
    key: "dialog",
    value: function dialog(type) {
      if (type == 'bet') {
        ReactDOM.render( /*#__PURE__*/React.createElement(BetDialog, null), document.getElementById('bet-dialog'));
      }
    }
  }, {
    key: "render",
    value: function render() {
      var pool = this.state.gamePool;
      var balance = this.state.accountBalance;
      var profit = this.state.accountProfit;
      var debt = this.state.accountDebt;
      var circulation = this.state.bankCirculation;
      var supply = this.state.bankSupply;
      var poolRenderAmount = this.formatNumber(pool);
      var accountBalanceRenderAmount = this.formatNumber(balance);
      var profitRenderAmount = this.formatNumber(profit);
      var debtRenderAmount = this.formatNumber(debt);
      var circulationRenderAmount = this.formatNumber(circulation);
      var supplyRenderAmount = this.formatNumber(supply); //Currently unused.

      return /*#__PURE__*/React.createElement("div", {
        id: "app-content"
      }, /*#__PURE__*/React.createElement(GameName, {
        gameName: this.state.gameName,
        setNameFunction: this.setGameName
      }), /*#__PURE__*/React.createElement(GamePool, {
        pool: poolRenderAmount,
        minBet: this.state.gameMinBet,
        currencySymbol: this.state.bankCurrencySymbol,
        canBet: this.state.canBet,
        mustCall: this.state.mustCall,
        betFunction: this.state.mustCall ? this.call : this.placeBet,
        myBet: this.state.myBet,
        folded: this.state.folded
      }), /*#__PURE__*/React.createElement(BankGrid, {
        circulation: circulationRenderAmount,
        currencySymbol: this.state.bankCurrencySymbol,
        supply: supplyRenderAmount,
        lang: this.state.lang
      }), /*#__PURE__*/React.createElement(AccountGrid, {
        balance: accountBalanceRenderAmount,
        debt: debtRenderAmount,
        currencySymbol: this.state.bankCurrencySymbol,
        profit: profitRenderAmount,
        lang: this.state.lang
      }), /*#__PURE__*/React.createElement(ControlGrid, {
        payDebtFunction: this.payDebt,
        loanFunction: this.loan,
        betFunction: this.state.mustCall ? this.call : this.placeBet,
        endGameFunction: this.endGame,
        createGameFunction: this.createGame,
        foldFunction: this.fold,
        minBet: this.state.gameMinBet,
        mustCall: this.state.mustCall,
        lang: this.state.lang,
        dialog: this.dialog
      }), /*#__PURE__*/React.createElement(LoginGrid, {
        connectFunction: this.fetchData,
        disconnectFunction: this.disconnect,
        createAccountFunction: this.createAccount,
        username: this.state.accountUsername
      }));
    }
  }]);

  return App;
}(React.Component);