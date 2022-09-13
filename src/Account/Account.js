import React, {useState, useEffect} from 'react';
import GameList from '../GameList/GameList.js';
import Forbidden from '../forbidden';
import Balance from '../Balance/Balance.js';
import AppContext from '../Contexts/AppContext.js';

function Account(props){
    const {user, token} = useContext(AppContext);

    if(user === null){
        return <Forbidden/>
    }
    else{
        return (
            <div className="flex-column fill center-all" id="account-page">
                <h1>Your Account</h1>
                <button>Close Account</button>
            </div>
        );
    }
    
}

export default Account;