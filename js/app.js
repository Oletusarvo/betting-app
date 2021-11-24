class App extends React.Component{

    constructor(props){
        super(props);

        this.socket = io();

        this.state = props.state;

        const env = this;

        this.socket.on('login_success', (username) => {
            this.state.account.username = username;
            alert("Logged in as " + username);

            this.updateState();
        });

        this.socket.on('end_game_request', (id) =>{
            //Cast your vote on wheter you think the game should end or not.
            const vote = confirm("Someone requested to end the game. Do you agree?");

            env.socket.emit('end_game_vote', vote);
        });

        this.socket.on('bank_update', msg =>{
            const data = JSON.parse(msg);

            const circ = data.circulation;
            const cs = data.currencySymbol;
            const supply = data.supply;

            env.state.bank.circulation = circ;
            env.state.bank.currencySymbol = cs;
            env.state.bank.supply = supply;

            env.updateState();
        });

        this.socket.on('game_update', msg =>{

            if(this.state.account.username == undefined) return;
            
            const data = JSON.parse(msg);

            env.state.game.pool = data.pool;

            const previousMinBet = env.state.game.minBet;
            env.state.game.minBet = data.minBet;

            if(previousMinBet < env.state.game.minBet) env.state.game.hasToCall = true;

            env.updateState();
        });

        this.socket.on('account_update', msg => {
            const data = JSON.parse(msg);
            env.state.account.balance = data.balance;
            env.state.account.debt = data.debt;
            env.state.account.profit = data.profit;

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
            this.state.accounts.username = undefined;
            this.updateState();
            alert("Logged out successfully.");
        });

        this.socket.on('fold_rejected', msg => {
            alert(`Cannot fold! Reason: ${msg}`);
        });

        this.socket.on('bet_rejected', msg => {
            alert(`Cannot place bet! Reason: ${msg}`);
        });

        this.socket.on('call_rejected', msg => {
            alert(`Cannot call! Reason: ${msg}`);
        });

        this.socket.on('general_error', msg => {
            alert(`${msg}`);
        });

        this.socket.on('login_rejected', msg => {
            alert(`Login was rejected! Reason ${msg}`)
        })
        
        this.updateState = this.updateState.bind(this);
        this.placeBet = this.placeBet.bind(this);
        this.loan = this.loan.bind(this);
        this.payDebt = this.payDebt.bind(this);
        this.endGame = this.endGame.bind(this);
        this.createGame = this.createGame.bind(this);
        this.fold = this.fold.bind(this);
        this.connect = this.connect.bind(this);
        this.disconnect = this.disconnect.bind(this);
        this.call = this.call.bind(this);
    }


    updateState(){
        this.setState(this.state);
    }

    placeBet(){
        const input = prompt("Enter amount to bet:", this.state.game.minBet.toFixed(2) || 0.1);
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

        const msg = {from: this.state.account.username, to: "server", data: bet}
        this.sendMessage('place_bet', msg);
    }

    fold(){
        const answer = confirm("Do you really want to fold?");

        if(answer == false) return;

        const msg = {from: this.state.account.username, to: "server", data: null}
        this.sendMessage('fold', msg);
    }

    call(){
        const amount = this.state.game.minBet;
        const answer = confirm(`Calling ${amount}, are you sure?`);
        
        if(answer == false) return;

        const bet = {
            amount : amount,
            side : -1,
            id : this.state.account.username
        }

        const msg = {from: this.state.account.username, to: "server", data: bet}
        this.sendMessage('call', msg);
    }

    payDebt(){
        const input =  prompt("Enter amount to pay:", 1);
        const amount = parseFloat(input);

        if(isNaN(amount)) {
            alert("Amount has to be a number!");
            return;
        };

        //this.socket.emit('pay_debt', amount);
        const msg = {from: this.state.account.username, to: "server", data: amount}
        this.sendMessage('pay_debt', msg);
    }

    loan(){
        const input = prompt("Enter amount you want to loan:");
        const amount = parseFloat(input);

        if(isNaN(amount)) {
            alert("Amount has to be a number!");
            return;
        };

        const msg = {from: this.state.account.username, to: "server", data: amount}
        this.sendMessage('loan', msg);
        
    }
    
    resetGame(){
        this.state.game.pool = 0;
        this.state.game.minBet = 0.01;
    }

    endGame(){
        const sideSelector = document.querySelector("#input-game-bool");
        const result = sideSelector.value === "True";
        
        const msg = {from: this.state.account.username, to: "server", data: result}
        this.sendMessage('end_game_accepted', msg);
    }

    createGame(){
        const name = prompt("Enter game name");

        const answer = confirm("Is this name ok?: \"" + name + '\"');

        if(answer == false) return;

        const msg = {from: this.state.account.username, to: "server", data: name}
        this.sendMessage('create-game', msg);
    }

    numberFormat(number){
        if(isNaN(number)) return number;
        
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

    connect(){
        const input = document.querySelector("#input-username");
        const username = input.value;

        const msg = {from: username, to: "server", data: null}
        this.sendMessage('login', msg);
    }

    disconnect(){
        const username = this.state.account.username;
        const msg = {from: username, to: "server", data: null}
        this.sendMessage('logout', msg);
    }

    render(){

        const pool          = this.state.game.pool;
        const balance       = this.state.account.balance;
        const profit        = this.state.account.profit;
        const debt          = this.state.account.debt;
        const circulation   = this.state.bank.circulation;
        const supply        = this.state.bank.supply;
        
        const poolRenderAmount              = this.numberFormat(pool);
        const accountBalanceRenderAmount    = this.numberFormat(balance);
        const profitRenderAmount            = this.numberFormat(profit);
        const debtRenderAmount              = this.numberFormat(debt);
        const circulationRenderAmount       = this.numberFormat(circulation);
        const supplyRenderAmount            = this.numberFormat(supply);

        return(
            <div id="app-content">
                <GameName gameName={this.state.game.name}/>

                <GamePool 
                    pool={poolRenderAmount}
                    minBet={this.state.game.minBet}
                    currencySymbol={this.state.bank.currencySymbol}
                />

                <BankGrid 
                    circulation={circulationRenderAmount} 
                    currencySymbol={this.state.bank.currencySymbol}
                    supply={supplyRenderAmount}
                />

                <AccountGrid 
                    balance={accountBalanceRenderAmount} 
                    debt={debtRenderAmount}
                    currencySymbol="mk"
                    profit={profitRenderAmount}
                />

                <ControlGrid 
                    payDebtFunction={this.payDebt} 
                    loanFunction={this.loan} 
                    placeBetFunction={this.placeBet}
                    endGameFunction={this.endGame} 
                    createGameFunction={this.createGame}
                    foldFunction={this.fold}
                    callFunction={this.call}
                    minBet={this.state.game.minBet}
                    hasToCall={false}
                />

                <LoginGrid
                    connectFunction={this.connect} 
                    disconnectFunction={this.disconnect}
                    username={this.state.account.username}
                />
            </div>
        );
    }
}