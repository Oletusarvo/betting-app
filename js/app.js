class App extends React.Component{

    constructor(props){
        super(props);

        this.socket = io();

        this.state = props.state;

        const env = this;

        this.socket.on('bank_update', msg =>{
            const data = JSON.parse(msg);

            const circ = data.circulation;
            const cs = data.currencySymbol;

            env.state.bank.circulation = circ;
            env.state.bank.currencySymbol = cs;

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
        const input = document.querySelector("#input-bet-amount");
        const amount = parseFloat(input.value);

        if(typeof amount !== "number") return;

        if(amount < this.state.game.minBet){
            //Flash the game pool ring as red.
            //const gamePoolRingElement = document.querySelector("#game-pool-border-circle");
            //gamePoolRingElement.classList.add("flash");
            return;
        }
        if(amount > this.state.account.balance){
            //Flash the account balance output as red.
            //const accountBalanceOutput = document.querySelector("#output-account-balance");
            //accountBalanceOutput.classList.add("flash");

            //Use timer to turn the color back to white.
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
        const input = document.querySelector("#input-bank");
        const amount = parseFloat(input.value);

        if(typeof amount !== "number") return;

        if(amount > this.state.account.balance) return;
        if(amount > this.state.account.debt) return;

        this.socket.emit('pay_debt', amount);
    }

    loan(){
        const input = document.querySelector("#input-bank");
        const amount = parseFloat(input.value);

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
        
        this.socket.emit('end_game', result);
    }

    createGame(){
        const name = prompt("Enter game name");

        const answer = confirm("Is this name ok?: \"" + name + '\"');

        if(answer == false) return;

        this.socket.emit('create-game', name);
    }

    render(){

        const pool = this.state.game.pool;
        const poolRenderAmount = pool >= 1000000 ? (pool / 1000000).toFixed(2) + "m" : pool >= 1000 ? (pool / 1000).toFixed(2) + "k" : pool.toFixed(2);

        return(
            <div id="app-content">

                <GameName gameName={this.state.game.name}/>

                <GamePool 
                    pool={poolRenderAmount}
                    minBet={this.state.game.minBet}
                    currencySymbol={this.state.bank.currencySymbol}
                />

                <BankGrid 
                    circulation={this.state.bank.circulation} 
                    currencySymbol={this.state.bank.currencySymbol}
                />

                <AccountGrid 
                    balance={this.state.account.balance} 
                    debt={this.state.account.debt}
                    currencySymbol="mk"
                    profit={this.state.account.profit}
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