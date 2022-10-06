import React, {useRef, useState} from 'react';
import GameList from '../GameList/GameList.js';
import './Style.scss';

function Games(props){

    const [query, setQuery] = useState('');

    function search(e){
        setTimeout(() => setQuery(e.target.value), 250);
    }

    return (
        <div className="flex-column fill pad w-100 gap-m overflow-y-scroll overflow-x-hide" id="games-page">
            <header className="w-100" id="games-page-header">
                <h1 className="flex-row center-all">All Bets</h1>
            </header>
            
            <GameList query={query}/>
        </div>
    );
}

export default Games;