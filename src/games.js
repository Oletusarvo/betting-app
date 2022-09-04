import React, {useState} from 'react';
import GameList from './GameList/GameList.js';

function Games(props){
    return (
        <div className="page">
            <h1>All Bets</h1>
            <GameList/>
        </div>
    );
}

export default Games;