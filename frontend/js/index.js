"use strict";

var vars = {
  game: {
    pool: 0,
    minBet: 0,
    name: "default",
    hasToCall: false
  },
  bank: {
    circulation: 0,
    currencySymbol: "def"
  },
  account: {
    debt: 0,
    balance: 0,
    profit: 0
  }
};
ReactDOM.render( /*#__PURE__*/React.createElement(App, {
  state: vars
}), document.getElementById("root"));