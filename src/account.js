import React, {useState, useEffect} from 'react';
import GameList from './GameList/GameList.js';
import Forbidden from './forbidden';

function Account(props){

    const [balance, setBalance] = useState(0);
    const {username, token} = props.user;

    useEffect(() => {
        const req = new XMLHttpRequest();
        req.open('GET', `/accounts/${username}`, true);
        req.setRequestHeader('auth', token);
        req.send();

        req.onload = () => {
            if(req.status === 200){
                setBalance(
                    JSON.parse(req.response).balance
                );
            }
        }
    }, []);

    if(props.user === null){
        return <Forbidden/>
    }
    else{
        return (
            <div className="page" id="account-page">
                <h1>Your Account</h1>
                <div id="account-info">
                    <h3>Total Balance:</h3>
                    <h1>${balance.toFixed(2)}</h1>
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