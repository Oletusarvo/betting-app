import React from 'react';
import Notifications from './notifications';
import GameList  from './GameList/GameList.js';
import Balance from './Balance/Balance.js';

function Home(props){

    const {username, balance} = props.user ? props.user : {};
    const {token} = props;

    return (
        <div className="page" id="home-page">
            {
                props.user === null ? 
                <h1>Home</h1> :
                <>  
                    <h2>Logged in as {username}</h2>
                    <h3>Total Balance:</h3>
                    <h1><Balance username={username} token={token}/></h1>

                    <h2>Bets created by you:</h2>
                    <GameList username={username} token={token}/>
                </>
                
            }
        </div>
    );
}

export default Home;