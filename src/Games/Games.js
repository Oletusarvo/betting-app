import React, {useState} from 'react';
import GameList from '../GameList/GameList.js';
import './Style.scss';

function Games(props){
    return (
        <div className="flex-column fill pad w-100 gap-m overflow-y-scroll overflow-x-hide" id="games-page">
            <h1 className="flex-row center-all">All Bets</h1>
            <GameList/>
        </div>
    );
}

export default Games;