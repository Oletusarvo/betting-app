import React, {useContext, useState} from 'react';
import AddButton from '../Buttons/AddButton/AddButton.js';
import GameList from '../GameList/GameList.js';
import './Style.scss';

function Games(){

    const [query, setQuery] = useState(undefined);

    function search(e){
        setTimeout(() => setQuery(e.target.value), 250);
        console.log(query)
    }

    return (
        <div className="page" id="games-page">
            <header className="w-100 margin-bottom page-header" id="games-page-header">
                <h2 className="flex-row center-all">Kaikki Vedot</h2>
                <input type="search" placeholder="Etsi..." onInput={search}></input>
            </header>
            
            <GameList title={query}/>
        </div>
    );
}

export default Games;