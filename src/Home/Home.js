import React from 'react';
import {Link} from 'react-router-dom';
import GameList  from '../GameList/GameList.js';
import Balance from '../Balance/Balance.js';
import './Style.scss';

function Home(props){

    const {username} = props.user ? props.user : {};
    const {token} = props;

    return (
        <>
        <div className="flex-column fill center-align w-100 pad overflow-y-scroll overflow-x-hide gap-default" id="home-page">
            {
                props.user === null ? 
                <div className="container glass">
                    <h1>Betting App</h1>
                    <br/>
                    <p>
                        <strong>Notice! This app is intended to be viewed on mobile devices in portrait mode.</strong><br/><br/>
                        Welcome to the betting app! Here you can create bets out of 
                        anything you choose and bid virtual currency in the form of dice.
                        Each new account receives 100 dice for use in betting. While 
                        creating an account, it is recommended to use passwords you don't normally use anywhere else.
                        The passwords are encrypted in the database, but it is not a bad idea to be safe.
                    </p>
                    <br/>
                    <h2>Bets</h2>
                    <br/>
                    <h3>Types</h3>
                    <p>
                        There are two types of bets that can currently be made: 
                    </p>
                    <br/>
                    <p>
                        <strong>Boolean</strong> bets can have an outcome of either true or false. Simple.<br/><br/>
                        <strong>Multi-Choice</strong> bets can have multiple outcomes that the user is free to define.
                    </p>
                    <br/>

                    <h3>Progression</h3>
                    <p>
                        Bets get started when a user creates one through navigating to the bet creation window by
                        pressing the plus icon on the navbar at the bottom of the screen. Once the parameters have been set and the 
                        bet has been accepted by the server, betting can begin.<br/><br/>
                    
                        The betting window for each bet can be accessed through first navigating to the game list window
                        through the casino-chip icon on the navbar and then tapping/clicking on the listing of the 
                        bet you want to participate in. <br/>
                    </p>
                    <br/>
                
                    <p>
                        <strong>The app is currently in development, so expect to find bugs while using it. Happy betting!</strong>
                    </p>
                </div>
                :
                <>  
                    <h2>Logged in as {username}</h2>
                    <div className="sep"></div>
                    <h3>Total Balance:</h3>
                    <h1><Balance username={username} token={token}/></h1>
                    <div className="sep"></div>
                    <h2>Bets created by you:</h2>
                    <GameList byUser={true}/>
                    <div>
                        <Link to="/account/delete">Delete Account</Link>
                    </div>
                    
                </>
                
            }
        </div>
        
        </>
        
        
    );
}

export default Home;