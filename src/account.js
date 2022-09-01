import React from 'react';
import Forbidden from './forbidden';
import GameList from './gamelist';
import Notifications from './notifications';

class Account extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            gamelist : [],
            loading : true
        }
    }

    render(){
        if(this.props.appState.user === null){
            return <Forbidden/>
        }
        else{
            return (
                <div className="page" id="account-page">
                    <h1>Your Account</h1>
                    <div id="account-info">
                        <h3>Total Balance:</h3>
                        <h1>${this.props.appState.user.balance.toFixed(2)}</h1>
                    </div>
                    <GameList 
                        gamelist={this.state.gamelist} 
                        loading={this.state.loading} 
                        deleteEnabled={true} 
                        title="Bets Created By You"
                        appState={this.props.appState}
                        updateAppState={this.props.updateAppState}
                    />
                </div>
            );
        }
    }

    componentDidMount(){
        if(this.props.appState.user && this.state.gamelist.length == 0){
            const req = new XMLHttpRequest();
            req.open('GET', `/games/${this.props.appState.user.username}`, true);
            req.setRequestHeader('Content-Type', 'application/json');
            req.setRequestHeader('auth', this.props.appState.token);
            req.send();

            req.onload = () => {
                if(req.status == 200){
                    this.state.gamelist = JSON.parse(req.response);
                    this.state.loading = false;
                    this.setState(this.state);
                }
            }
        }
    }
}

export default Account;