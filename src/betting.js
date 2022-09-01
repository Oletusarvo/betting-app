import React from 'react';

class Betting extends React.Component{
    constructor(props){
        super(props);

        this.socket = io();

        this.state = {
            selectedGame : this.props.selectedGame,
            bet : {
                amount : 'none',
                side : 'none'
            }
        };

        this.socket.on('bet_update', data =>{
            const {game, bet} = JSON.parse(data);
            this.state.selectedGame = game;
            this.state.bet = bet;
            this.setState(this.state);
        });

        this.socket.on('bet_rejected', msg => {
            alert(`Bet rejected! Reason: ${msg}`);
        });

        this.socket.on('account_update', data => {
            const user = JSON.parse(data);
            const appState = this.props.appState;
            appState.user = user;
            this.props.updateAppState(appState);
        });

        this.socket.on('consolidated_bet', data => {
            const consolidated = JSON.parse(data);
            this.bet = consolidated;
        });

        this.socket.emit('get_bet_data', JSON.stringify({
            game_id : this.state.selectedGame.game_id,
            username : this.props.appState.user.username}));

        this.placeBet = this.placeBet.bind(this);
        this.fold = this.fold.bind(this);
        this.returnFunction = this.returnFunction.bind(this);
        this.call = this.call.bind(this);
        this.displayBet = this.displayBet.bind(this);
    }

    placeBet(bet){
        this.socket.emit('bet', JSON.stringify(bet));
    }

    fold(){
        const answer = confirm('You are about to fold. Are you sure?');

        if(!answer) return;

        this.socket.emit('fold', JSON.stringify({
            game_id : this.state.selectedGame.game_id,
            username : this.props.appState.user.username
        }));
    }

    call(){
        const amount = this.state.selectedGame.minimum_bet - this.state.bet.amount;
        if(amount > 0){
            const answer = confirm(`You are about to increase your bet by ${amount}, are you sure?`);
            if(answer){
                const bet = {
                    game_id : this.state.selectedGame.game_id,
                    amount,
                    username : this.props.appState.user.username,
                    side : this.state.bet.side
                };

                this.placeBet(bet);
            }
        }
        else{
            alert('You cannot bet at this time.');
        } 
    }

    returnFunction(){
        const state = undefined;
        this.props.updateGameState(state, () => location.assign('/#/games'));
    }

    displayBet(){
        const bet = this.state.bet;
        if(bet){
            if(bet.folded){
                return `Folded`;
            }
            else{
                return `\'${bet.side}\' for ${'$' + bet.amount}`;
            }
        }
        else{
            return 'None';
        }
    }

    render(){
        return (
            <div className="page" id="betting-page">
                <div className="betting-container container" id="bet-title">
                    <div id="back-button" onClick={this.returnFunction}>
                        <img src="../img/arrow.png"></img>
                    </div>
                    <h3 id="bet-name">{this.state.selectedGame.game_title}</h3>
                </div>

                <div className="betting-container container" id="bet-info">
                    <table>
                        <tbody>
                            <tr>
                                <td>Your Balance:</td>
                                <td className="align-right">${this.props.appState.user.balance.toFixed(2)}</td>
                            </tr>

                            <tr>
                                <td>Your Bet:</td>
                                <td className="align-right">{this.displayBet()}</td>
                            </tr>
                            <tr>
                                <td>Minimum Bet: </td>
                                <td className="align-right">${this.state.selectedGame.minimum_bet.toFixed(2)}</td>
                            </tr>

                            <tr>
                                <td>Increment:</td>
                                <td className="align-right">${this.state.selectedGame.increment.toFixed(2)}</td>
                            </tr>

                            <tr>
                                <td>Expiry Date:</td>
                                <td className="align-right">{this.state.selectedGame.expiry_date}</td>
                            </tr>

                            <tr>
                                <td>Time Left:</td>
                                <td className="align-right">
                                    {this.state.selectedGame.expiry_date != 'When Closed' ? Math.round((new Date(this.state.selectedGame.expiry_date) - new Date()) / 1000 / 60 / 60 / 24) + ' days' : 'No Limit'}
                                    
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="betting-container container" id="bet-pool">
                    <div id="bet-pool-ring" className={this.state.bet.amount == 0 ? 'entry' : this.state.bet.amount < this.state.selectedGame.minimum_bet && this.state.bet.folded == false ? 'call' : 'set'} onClick={this.call}>
                       <h1>${this.state.selectedGame.pool.toFixed(2)}</h1>
                    </div>
                </div>
                <div className="betting-container container" id="bet-controls">
                    <form id="betting-form">
                        <input type="number" name="amount" placeholder="Bet Amount" min="0.01" step={this.state.selectedGame.increment}></input>
                        <select name="side">
                            <option>Kyllä</option>
                            <option>Ei</option>
                        </select>
                        <button type="submit">Place Bet</button>
                        <button onClick={this.fold} type="button">Fold</button>
                    </form>
                </div>
            </div>
        )
    }

    componentDidMount(){
        const form = document.querySelector('#betting-form');
        form.addEventListener('submit', e => {
            e.preventDefault();
            const data = {
                amount : form.amount.value,
                username : this.props.appState.user.username,
                game_id : this.state.selectedGame.game_id,
                side : form.side.value
            }

            this.placeBet(data);
        });
    }
}

export default Betting;