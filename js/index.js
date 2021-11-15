let vars = {
    game : {pool : 0, minBet : 0, myLastBet : 0, name : "default"},
    bank : {circulation : 0, currencySymbol : "def"},
    account : {debt : 0, balance : 0, profit : 0}
}

ReactDOM.render(
    <App state={vars}/>,
    document.getElementById("root")
);