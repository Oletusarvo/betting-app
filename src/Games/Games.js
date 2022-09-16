import React, {useState} from 'react';
import GameList from '../GameList/GameList.js';

function Games(props){
    return (
        <div className="flex-column fill center-align pad w-100 gap-default overflow-y-scroll overflow-x-hide">
            <h1>All Bets</h1>
            <GameList/>
        </div>
    );
}

export default Games;