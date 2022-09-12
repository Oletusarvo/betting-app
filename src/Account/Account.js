import React, {useState, useEffect} from 'react';
import GameList from '../GameList/GameList.js';
import Forbidden from '../forbidden';
import Balance from '../Balance/Balance.js';

function Account(props){
    const {username, token} = props.user;

    if(props.user === null){
        return <Forbidden/>
    }
    else{
        return (
            <div className="flex-column fill center-all" id="account-page">
                <h1>Your Account</h1>
                <div id="account-info">
                    <h3>Total Balance:</h3>
                    <h1><Balance username={props.username} token={props.token}/></h1>
                </div>
                <h1>Bets created by you:</h1>
                <GameList 
                    username={props.user.username}
                    token={props.token}
                />
            </div>
        );
    }
    
}

export default Account;