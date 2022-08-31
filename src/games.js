import React from 'react';
import Betting from './betting';
import GameList from './gamelist';
import Forbidden from './forbidden';

class Games extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            gamelist : [],
            loading : true,
            selectedGame : undefined
        }

        this.selectGameFunction = this.selectGameFunction.bind(this);
        this.bettingReturnFunction = this.bettingReturnFunction.bind(this);
    }

    selectGameFunction(game){
        this.state.selectedGame = game;
        this.setState(this.state);
    }

    bettingReturnFunction(){
        this.state.selectedGame = undefined;
        this.setState(this.state);
    }

    render(){
        if(this.state.selectedGame !== undefined){
            return <Betting 
                selectedGame={this.state.selectedGame} 
                bettingReturnFunction={this.bettingReturnFunction}
                updateState={this.props.updateState}
                state={this.props.state}
                />
        }
        else if(this.props.state.user === null){
            return <Forbidden/>
        }
        else{
            return <GameList 
                gamelist={this.state.gamelist} 
                loading={this.state.loading} 
                selectGameFunction={this.selectGameFunction}
                title="All Bets"
                state={this.props.state}
                updateState={this.props.updateState}
                />
        }
    }

    componentDidMount(){
        if(this.state.gamelist.length == 0 || this.state.selectedGame === undefined){

            const req = new XMLHttpRequest();
            req.open('GET', '/games', true);

            const payload = {
                token : this.props.state.token
            };

            req.setRequestHeader('Content-Type', 'application/json');
            req.setRequestHeader('auth', this.props.state.token);

            req.send(JSON.stringify(payload));

            req.onload = () => {
                if(req.status === 200){
                    const gamelist = JSON.parse(req.response);
                    this.state.gamelist = gamelist;
                }

                this.state.loading = false;
                this.setState(this.state);
            }
        }
    }
}

export default Games;