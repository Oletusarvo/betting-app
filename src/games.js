import React from 'react';
import Betting from './betting';
import GameList from './gamelist';
import Forbidden from './forbidden';
import {HashRouter as Router, Route, Routes} from 'react-router-dom';

class Games extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            gamelist : [],
            loading : true,
            selectedGame : undefined
        }

        this.selectGame = this.selectGame.bind(this);
        this.bettingReturnFunction = this.bettingReturnFunction.bind(this);
        this.downloadGameList = this.downloadGameList.bind(this);
        this.updateGameState = this.updateGameState.bind(this);
    }

    downloadGameList(){
        const req = new XMLHttpRequest();
        req.open('GET', '/games', true);

        const payload = {
            token : this.props.appState.token
        };

        req.setRequestHeader('Content-Type', 'application/json');
        req.setRequestHeader('auth', this.props.appState.token);

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

    selectGame(game){
        this.state.selectedGame = game;
        this.setState(this.state);
    }

    bettingReturnFunction(){
        this.state.selectedGame = undefined;
        this.downloadGameList();
    }

    updateGameState(selectedGame, callback = undefined){
        const state = this.state;
        state.selectedGame = selectedGame;
        this.setState(state, callback);
    }

    render(){
        if(this.state.selectedGame !== undefined){
            return <Betting 
                updateAppState={this.props.updateState}
                updateGameState={this.updateGameState}
                appState={this.props.appState}
                selectedGame={this.state.selectedGame}
                gameState={this.state}
                />
        }
        else if(this.props.appState.user === null){
            return <Forbidden/>
        }
        else{
            return <GameList 
                gamelist={this.state.gamelist} 
                loading={this.state.loading} 
                selectGame={this.selectGame}
                title="All Bets"
                appState={this.props.appState}
                updateState={this.props.updateState}
                />
        }
    }

    componentDidMount(){
        if(this.state.gamelist.length == 0 || this.state.selectedGame === undefined){
            const req = new XMLHttpRequest();
            req.open('GET', '/games', true);

            const payload = {
                token : this.props.appState.token
            };

            req.setRequestHeader('Content-Type', 'application/json');
            req.setRequestHeader('auth', this.props.appState.token);

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