const initState = {
    lang: "eng",
    gamePool: 0,
    gameMinBet: undefined,
    gameName: 'game name',

    myBet: undefined,
    
    bankCirculation: 0,
    bankSupply: 0,
    bankCurrencySymbol: 'def',

    accountDebt: 0,
    accountBalance: 0,
    accountProfit: 0,
    accountUsername: undefined,

    mustCall: false,
    canBet: false,
    participating: false,
    folded : false
}

let vars = initState;

ReactDOM.render(
    <App state={vars} initState={initState}/>,
    document.getElementById("root")
);