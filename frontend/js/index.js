"use strict";

var initState = {
  game: {
    pool: 0,
    minBet: undefined,
    name: "game name",
    hasToCall: false
  },
  bank: {
    circulation: 0,
    supply: 0,
    currencySymbol: "def"
  },
  account: {
    debt: 0,
    balance: 0,
    profit: 0,
    username: undefined
  }
};
var vars = initState;
ReactDOM.render( /*#__PURE__*/React.createElement(App, {
  state: vars,
  initState: initState
}), document.getElementById("root"));