import React from 'react';
import Notifications from '../notifications';
import GameList  from '../GameList/GameList.js';
import Balance from '../Balance/Balance.js';
import './Style.scss';

function Home(props){

    const {username, balance} = props.user ? props.user : {};
    const {token} = props;

    return (
        <div className="flex-column fill center-align w-100 pad overflow-y-scroll overflow-x-hide gap-default" id="home-page">
            {
                props.user === null ? 
                <h1>Home</h1> :
                <>  
                    <h2>Logged in as {username}</h2>
                    <div className="sep"></div>
                    <h3>Total Balance:</h3>
                    <h1><Balance username={username} token={token}/></h1>
                    <div className="sep"></div>
                    <h2>Bets created by you:</h2>
                    <GameList byUser={true}/>
                </>
                
            }
        </div>
    );
}

export default Home;