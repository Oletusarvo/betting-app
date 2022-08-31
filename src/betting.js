import React from 'react';

class Betting extends React.Component{
    constructor(props){
        super(props);

        this.socket = io();
        this.state = this.props.selectedGame;

        this.socket.on('bet_update', data =>{
            const game = JSON.parse(data);
            this.state = game;
            this.setState(this.state);
        });

        this.socket.on('bet_rejected', msg => {
            alert(msg);
        });

        this.socket.emit('get_bet_data', this.state.game_id);
    }

    placeBet2(bet){
        this.socket.emit('bet', JSON.stringify(bet));
    }

    placeBet(bet){
        const state = this.props.state;

        state.action = 'betting';
        this.props.updateState(state, () => {
            const req = new XMLHttpRequest();
            req.open('POST', '/games/bet', true);
            req.setRequestHeader('Content-Type', 'application/json');
            req.setRequestHeader('auth', state.token);
            req.send(JSON.stringify(bet));

            req.onload = () => {
                state.action = 'none';

                if(req.status === 200){
                    const res = JSON.parse(req.response);
                    state.user.balance = res.balance;
                    
                }
                else{
                    alert(`Bet failed! Reason: ${req.response}`);
                }

                this.props.updateState(state);
            }
        });
    }

    render(){
        return (
            <div className="page" id="betting-page">
                <div className="betting-container container" id="bet-title">
                    <div id="back-button" onClick={this.props.bettingReturnFunction}>
                        <img src="../img/arrow.png"></img>
                    </div>
                    <h3 id="bet-name">{this.state.game_title}</h3>
                </div>

                <div className="betting-container container" id="bet-info">
                    <table>
                        <tbody>
                            <tr>
                                <td>Minimum Bet: </td>
                                <td className="align-right">${this.state.minimum_bet.toFixed(2)}</td>
                            </tr>

                            <tr>
                                <td>Increment:</td>
                                <td className="align-right">${this.state.increment.toFixed(2)}</td>
                            </tr>

                            <tr>
                                <td>Expiry Date:</td>
                                <td className="align-right">{this.state.expiry_date}</td>
                            </tr>

                            <tr>
                                <td>Time Left:</td>
                                <td className="align-right">
                                    {this.state.expiry_date != 'When Closed' ? Math.round((new Date(this.state.expiry_date) - new Date()) / 1000 / 60 / 60 / 24) + ' days' : 'No Limit'}
                                    
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="betting-container container" id="bet-pool">
                    <div id="bet-pool-ring">
                       <h1>${this.state.pool.toFixed(2)}</h1>
                    </div>
                </div>
                <div className="betting-container container" id="bet-controls">
                    <form id="betting-form">
                        <input type="number" name="amount" placeholder="Bet Amount" min={this.state.minimum_bet} step={this.state.increment}></input>
                        <select name="side">
                            <option>Kyllä</option>
                            <option>Ei</option>
                        </select>
                        <button>Place Bet</button>
                        <button>Fold</button>
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
                username : this.props.state.user.username,
                game_id : this.state.game_id,
                side : form.side.value
            }

            this.placeBet2(data);
        });
    }
}

export default Betting;