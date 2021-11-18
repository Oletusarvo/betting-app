class App extends React.Component{

    constructor(props){
        super(props);

        this.socket = io();

        this.state = props.state;

        const env = this;

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
            const data = JSON.parse(msg);

            env.state.game.pool = data.pool;

            const previousMinBet = env.state.game.minBet;
            env.state.game.minBet = data.minBet;

            if(previousMinBet < env.state.game.minBet) this.state.game.hasToCall = true;

            env.updateState();
        });

        this.socket.on('account_update', msg => {
            const data = JSON.parse(msg);
            env.state.account.balance = data.balance;
            env.state.account.debt = data.debt;
            env.state.account.profit = data.profit;

            env.updateState();
        });

        this.socket.on('loan_rejected', amount =>{
            alert("Your loan request of " + amount + " was rejected!");
        })

       
        this.updateState = this.updateState.bind(this);
        this.placeBet = this.placeBet.bind(this);
        this.loan = this.loan.bind(this);
        this.payDebt = this.payDebt.bind(this);
        this.endGame = this.endGame.bind(this);
        this.createGame = this.createGame.bind(this);
        this.fold = this.fold.bind(this);
    }


    updateState(){
        this.setState(this.state);
    }

    placeBet(){

        if(this.state.game.folded){
            alert("You cannot bet in this game as you have folded.");
            return;
        } 

        const input = prompt("Enter amount to bet:", this.state.game.minBet.toFixed(2) || 0.1);
        const amount = parseFloat(input);

        if(typeof amount !== "number") return;

        if(amount < this.state.game.minBet){
            alert("You must bet more or equal to the minimum bet of " + this.state.game.minBet || 0.1);
            return;
        }
        if(amount > this.state.account.balance){
            alert("You are trying to bet more than your balance!");
            return;
        }

        const sideSelector = document.querySelector("#input-game-bool");
        const side = sideSelector.value === "True";

        /*
        const answer = confirm("You are about to bet " + side + " for " + amount + " " + this.state.bank.currencySymbol + ". Are you sure?");

        if(answer == false) return;
        */
       
        const bet = {
            id : this.socket.id,
            amount : amount,
            side : side
        }

        this.socket.emit('place_bet', JSON.stringify(bet));
    }

    fold(){
        const answer = confirm("Do you really want to fold?");

        if(answer == false) return;

        this.socket.emit('fold', this.socket.id);
        this.state.game.folded = true;
    }

    call(){
        const amount = this.state.game.minBet;
        const answer = confirm("Calling " + amount + ". Are you sure?");
        
        if(answer == false) return;

        this.socket.emit('place_bet', JSON.stringify({
            amount : amount,
            side : -1, //Bet side cannot be changed when there is already a bet out.
            id : this.socket.id
        }));
    }

    payDebt(){
        const input =  prompt("Enter amount to pay:", 1);
        const amount = parseFloat(input);

        if(typeof amount !== "number") return;

        if(amount > this.state.account.balance){
            alert("Amount exceedes balance!");
            return;
        }
        if(amount > this.state.account.debt){
            alert("Amount exceedes debt!");
            return;
        }

        this.socket.emit('pay_debt', amount);
    }

    loan(){
        const input = prompt("Enter amount you want to loan:");
        const amount = parseFloat(input);

        if(typeof amount !== "number") return;

        this.socket.emit('loan', amount);
    }
    
    resetGame(){
        this.state.game.pool = 0;
        this.state.game.minBet = 0.01;
    }

    endGame(){
        const sideSelector = document.querySelector("#input-game-bool");
        const result = sideSelector.value === "True";
        
        this.socket.emit('end_game_accepted', result);
    }

    createGame(){
        const name = prompt("Enter game name");

        const answer = confirm("Is this name ok?: \"" + name + '\"');

        if(answer == false) return;

        this.socket.emit('create-game', name);
    }

    numberFormat(number){
        if(typeof number !== "number") return NaN;
        
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
    render(){

        const pool          = this.state.game.pool;
        const balance       = this.state.account.balance;
        const profit        = this.state.account.profit;
        const debt          = this.state.account.debt;
        const circulation   = this.state.bank.circulation;
        const supply        = this.state.bank.supply;

        const poolRenderAmount = this.numberFormat(pool);
        const accountBalanceRenderAmount = this.numberFormat(balance);
        const profitRenderAmount = this.numberFormat(profit);
        const debtRenderAmount = this.numberFormat(debt);
        const circulationRenderAmount = this.numberFormat(circulation);
        const supplyRenderAmount = this.numberFormat(supply);

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
                    hasToCall={this.state.game.hasToCall}
                />
            </div>
        );
    }
}