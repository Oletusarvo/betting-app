import React, {useContext} from 'react';
import {Link} from 'react-router-dom';
import GameList  from '../GameList/GameList.js';
import './Style.scss';
import AppContext from '../Contexts/AppContext.js';

function Home(){

    const {user} = useContext(AppContext);

    return (
        <>
        <div className="flex-column fill w-100 pad overflow-y-scroll overflow-x-hide gap-default" id="home-page">
            {
                user === null ? 
                <div className="container glass bg-fade">
                    <h1>Betting App</h1>
                    <br/>
                    <p>
                        <strong>Notice! This app is intended to be viewed on mobile devices in portrait mode.</strong><br/><br/>
                        Welcome to the betting app! Here you can create bets out of 
                        anything you choose and bid virtual currency in the form of dice. One hundred dice has the arbitrary value of 1 of whatever currency you choose.
                        Each new account receives 10,000 dice for use in betting.
                        Log in with username and password <strong>demo</strong> if you wish to not create an account at this time. (Betting disabled).
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
                        <strong>Multi-Choice</strong> bets have one outcome out of a list that the user is free to define.<br/><br/>
                        <strike><strong>Lottery</strong> bets let a user enter a single row of numbers, which gets compared to a randomly generated <br/>
                        row of equal length when the game is closed. Whoever has a row fully matching the generated row wins the pool.</strike>
                    </p>
                    <br/>

                    <h3>Progression</h3>
                    <p>
                        Bets get started when a user creates one through navigating to the bet creation window by
                        pressing the plus icon on the navbar at the bottom of the screen. Once the parameters have been set and the 
                        bet has been accepted by the server, betting can begin.<br/><br/>
                    
                        The betting window for each bet can be accessed through first navigating to the game list window
                        through the casino-chip icon on the navbar and then tapping/clicking on the listing of the 
                        bet you want to participate in. <br/><br/>

                        A bet can only be closed by the user who made it.
                    </p>
                    <br/>
                
                    <p>
                        <strong>The app is currently in development, so expect to find bugs while using it. Happy betting!</strong>
                    </p>
                </div>
                :
                <>  
                    <div id="home-account-content" className="fill flex-column">
                        <h2 className="align-text-center">Bets created by you:</h2>
                        <GameList byUser={true}/>
                    </div>
                    
                    <Link to="/account/delete" id="del-link">Delete Account</Link>
                    
                </>
            }
        </div>
        
        </>
    );
}

export default Home;