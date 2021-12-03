class App extends React.Component{

    constructor(props){
        super(props);

        this.socket = io();

        this.state = props.state;

        const env = this;

        this.socket.on('query_username', () => {
            const msg = {from: this.state.accountUsername, to: 'server', data: null}
            this.socket.emit('username', JSON.stringify(msg));
        });

        this.socket.on('login_success', (username) => {
            this.state.accountUsername = username;
            this.state.canBet = true;
            alert("Logged in as " + username);

            this.updateState();
        });

        this.socket.on('end_game_request', result =>{
            //Cast your vote on wheter you think the game should end or not.
            const vote = confirm(`A request to end the game with result \'${result}\' has been placed. Do you agree?`);
            this.state.canBet = false; //Until game either ends or the vote is rejected.
            const data = {from: env.state.accountUsername, to: 'server', data: {vote: vote, result: result}};
            env.socket.emit('end_game_vote', JSON.stringify(data));
            this.updateState();

        });

        this.socket.on('bank_update', msg =>{
            const data = JSON.parse(msg);

            const circ = data.circulation;
            const cs = data.currencySymbol;
            const supply = data.supply;

            env.state.bankCirculation = circ;
            env.state.bankCurrencySymbol = cs;
            env.state.bankSupply = supply;

            env.updateState();
        });

        this.socket.on('game_update', msg =>{

            if(this.state.accountUsername == undefined){
                console.log('Undefined username, returning.');
                return;
            }
            
            const data = JSON.parse(msg);

            env.state.gamePool = data.pool;
            env.state.gameMinBet = data.minBet;
            env.state.gameName = data.gameName;

            env.updateState();
        });

        this.socket.on('account_update', msg => {
            const data = JSON.parse(msg);
            env.state.accountBalance = data.balance;
            env.state.accountDebt = data.debt;
            env.state.accountProfit = data.profit;

            env.updateState();
        });

        this.socket.on('loan_rejected', msg =>{
            alert(`Your loan request was rejected! Reason: ${msg}`);
        });

        this.socket.on('game_contested', () => {
            alert("Contested game cannot be ended!");
        });

        this.socket.on('logout_success', () => {
            this.state = this.props.initState;
            this.state.accountsUsername = undefined;
            this.updateState();
            alert("Logged out successfully.");
        });

        this.socket.on('fold_rejected', msg => {
            alert(`Cannot fold! Reason: ${msg}`);
        });

        this.socket.on('fold_accepted', () => {
            this.state.canBet = this.state.mustCall = false;
            this.updateState();
        });

        this.socket.on('bet_rejected', msg => {
            alert(`Cannot place bet! Reason: ${msg}`);
        });

        this.socket.on('bet_accepted', amount => {
            env.state.myBet = amount;
            env.state.participating = true;
            env.state.canBet = false;
            this.updateState();
        });

        this.socket.on('call_rejected', msg => {
            alert(`Cannot call! Reason: ${msg}`);
        });

        this.socket.on('call_accepted', () => {
            this.state.mustCall = false;
            this.updateState();
        });

        this.socket.on('general_error', msg => {
            alert(`${msg}`);
        });

        this.socket.on('login_rejected', msg => {
            alert(`Login was rejected! Reason: ${msg}`)
        });

        this.socket.on('game_ended', () => {
            //alert('The game has been ended!');
            env.state.canBet = true;
            env.state.participating = false;
            env.state.mustCall = false;
            env.state.myBet = undefined;
            env.state.folded = undefined;
            this.updateState();
        });
        
        this.socket.on('end_game_rejected', msg => {
            alert(`Game cannot be ended! Reason: ${msg}`);
            env.state.canBet = true;
            this.updateState();
        });

        this.socket.on('game_raised', amount => {
            this.state.mustCall = this.state.myBet ? true : false; //Causes problems if user has a bet out and disconnects in-between.
            this.updateState();
        });

        this.socket.on('account_accepted', msg => {
            alert('Account accepted!');
            this.state.canBet = true;
            this.updateState();
        });

        this.socket.on('account_rejected', msg => {
            alert(`Account rejected! Reason: ${msg}`);
        });
        
        this.updateState = this.updateState.bind(this);
        this.placeBet = this.placeBet.bind(this);
        this.loan = this.loan.bind(this);
        this.payDebt = this.payDebt.bind(this);
        this.endGame = this.endGame.bind(this);
        this.fold = this.fold.bind(this);
        this.fetchData = this.fetchData.bind(this);
        this.disconnect = this.disconnect.bind(this);
        this.call = this.call.bind(this);
        this.setGameName = this.setGameName.bind(this);
        this.createAccount = this.createAccount.bind(this);
        this.dialog = this.dialog.bind(this);
    }


    updateState(){
        this.setState(this.state);
    }

    placeBet(){
        if(this.state.canBet == false){
            alert('You can not bet at this moment!');
            return;
        }

        const input = prompt("Enter amount to bet:", this.state.gameMinBet.toFixed(2) || 0.1);
        const amount = parseFloat(input);

        if(isNaN(amount)) {
            alert("Amount has to be a number!");
            return;
        }

        const sideSelector = document.querySelector("#input-game-bool");
        const side = sideSelector.value === "True";

        const bet = {
            id : this.socket.id,
            amount : amount,
            side : side
        }

        const msg = {from: this.state.accountUsername, to: "server", data: bet}
        this.sendMessage('place_bet', msg);
    }

    fold(){
        const answer = confirm("Do you really want to fold?");

        if(answer == false) return;

        const msg = {from: this.state.accountUsername, to: "server", data: null}
        this.sendMessage('fold', msg);
    }

    call(){
        const minimum = this.state.gameMinBet;
        const myBet = this.state.myBet;
        const callAmount = !isNaN(myBet) ? minimum - myBet : minimum;

        const answer = confirm(`Calling ${callAmount}, are you sure?`);
        
        if(answer == false) return;

        const bet = {
            amount : callAmount,
            side : -1,
            id : this.state.accountUsername
        }

        const msg = {from: this.state.accountUsername, to: "server", data: bet}
        this.sendMessage('call_bet', msg);
    }

    payDebt(){
        const input =  prompt("Enter amount to pay:", 1);
        const amount = parseFloat(input);

        if(isNaN(amount)) {
            alert("Amount has to be a number!");
            return;
        };

        //this.socket.emit('pay_debt', amount);
        const msg = {from: this.state.accountUsername, to: "server", data: amount}
        this.sendMessage('pay_debt', msg);
    }

    loan(){
        const input = prompt("Enter amount you want to loan:");
        const amount = parseFloat(input);

        if(isNaN(amount)) {
            alert("Amount has to be a number!");
            return;
        };

        const msg = {from: this.state.accountUsername, to: "server", data: amount}
        this.sendMessage('loan', msg);
        
    }
    
    resetGame(){
        this.state.gamePool = 0;
        this.state.gameMinBet = 0.01;
    }

    endGame(){
        /*
        if(this.state.participating == false){
            alert('You can not end the game as you are not participating in it!');
            return;
        }
        */

        const sideSelector = document.querySelector("#input-game-bool");
        const result = sideSelector.value === "True";

        //What if somebody else already did this?
        const answer = confirm(`You are about to request to end the game with result \'${result}\'. Are you sure?`);

        if(answer == false) return;

        const msg = {from: this.state.accountUsername, to: "server", data: result}
        this.sendMessage('end_game_bypass', msg);
    }

    setGameName(){
        const gameName = prompt("Enter game name");

        const answer = confirm("Is this name ok?: \"" + gameName + '\"');

        if(answer == false) return;

        const msg = {from: this.state.accountUsername, to: "server", data: gameName}
        this.sendMessage('set_game_name', msg);
    }

    formatNumber(number){
        if(isNaN(number)) return undefined;
        
        /*Compresses big numbers, adds a letter postfix representation of the quantity of the number and returns it as a string */
        const thousand = 1000;
        const million = 1000000;
        const billion = 1000000000;
        const trillion = 1000000000000;

        const postfix = number >= trillion ? 'T' : number >= billion ? 'B' : number >= million ? 'M' : number >= thousand ? 'K' : "";
        const compressed = 
            number >= trillion ? number / trillion :
            number >= billion ? number / billion : 
            number >= million ? number / million : 
            number >= thousand ? number / thousand : 
            number;

        return compressed.toFixed(2) + postfix;

    }

    sendMessage(type, msg){
        this.socket.emit(type, JSON.stringify(msg));
    }

    fetchData(){

        //TODO: change this to a post method.
        const inputUsername = document.querySelector("#input-username");
        const inputPassword = document.querySelector('#input-password');
        const username = inputUsername.value;
        const password = inputPassword.value;

        const msg = {from: username, to: "server", data: password}
        this.sendMessage('fetch_data', msg);
    }

    createAccount(){
        const inputUsername = document.querySelector("#input-username");
        const inputPassword = document.querySelector('#input-password');
        const username = inputUsername.value;
        const password = inputPassword.value;

        const answer = confirm(`About to create account with username ${username}. Are you sure?`);

        if(answer == false) return;

        const msg = {from: undefined, to: "server", data: { username : username, password : password}}
        this.sendMessage('create_account', msg);
    }

    disconnect(){
        const username = this.state.accountUsername;
        const msg = {from: username, to: "server", data: null}
        this.sendMessage('logout', msg);
    }

    dialog(type){
        if(type == 'bet'){
            ReactDOM.render(
                <BetDialog/>,
                document.getElementById('bet-dialog')
            );
        }
    }

    render(){

        const pool          = this.state.gamePool;
        const balance       = this.state.accountBalance;
        const profit        = this.state.accountProfit;
        const debt          = this.state.accountDebt;
        const circulation   = this.state.bankCirculation;
        const supply        = this.state.bankSupply;
        
        const poolRenderAmount              = this.formatNumber(pool);
        const accountBalanceRenderAmount    = this.formatNumber(balance);
        const profitRenderAmount            = this.formatNumber(profit);
        const debtRenderAmount              = this.formatNumber(debt);
        const circulationRenderAmount       = this.formatNumber(circulation);
        const supplyRenderAmount            = this.formatNumber(supply); //Currently unused.

        return(
            <div id="app-content">
                <GameName gameName={this.state.gameName} setNameFunction={this.setGameName}/>

                <GamePool 
                    pool={poolRenderAmount}
                    minBet={this.state.gameMinBet}
                    currencySymbol={this.state.bankCurrencySymbol}
                    canBet={this.state.canBet}
                    mustCall={this.state.mustCall}
                    betFunction={this.state.mustCall ? this.call : this.placeBet}
                    myBet={this.state.myBet}
                    folded={this.state.folded}
                />

                <BankGrid 
                    circulation={circulationRenderAmount} 
                    currencySymbol={this.state.bankCurrencySymbol}
                    supply={supplyRenderAmount}
                    lang={this.state.lang}
                />

                <AccountGrid 
                    balance={accountBalanceRenderAmount} 
                    debt={debtRenderAmount}
                    currencySymbol={this.state.bankCurrencySymbol}
                    profit={profitRenderAmount}
                    lang={this.state.lang}
                />

                <ControlGrid 
                    payDebtFunction={this.payDebt} 
                    loanFunction={this.loan} 
                    betFunction={this.state.mustCall ? this.call : this.placeBet}
                    endGameFunction={this.endGame} 
                    createGameFunction={this.createGame}
                    foldFunction={this.fold}
                    minBet={this.state.gameMinBet}
                    mustCall={this.state.mustCall}
                    lang={this.state.lang}
                    dialog={this.dialog}
                />

                <LoginGrid
                    connectFunction={this.fetchData} 
                    disconnectFunction={this.disconnect}
                    createAccountFunction={this.createAccount}
                    username={this.state.accountUsername}
                />
            </div>
        );
    }
}