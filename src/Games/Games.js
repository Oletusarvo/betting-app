import React, {useContext, useState} from 'react';
import GameList from '../GameList/GameList.js';
import './Style.scss';
import langStrings from "../lang";
import AppContext from '../Contexts/AppContext.js';

function Games(){

    const [query, setQuery] = useState('');
    const {lang} = useContext(AppContext);

    function search(e){
        setTimeout(() => setQuery(e.target.value), 250);
    }

    return (
        <div className="flex-column fill pad w-100 gap-m overflow-y-scroll overflow-x-hide" id="games-page">
            <header className="w-100" id="games-page-header">
                <h1 className="flex-row center-all">{langStrings["all-bets-header"][lang]}</h1>
                <input type="search" placeholder={langStrings["search-placeholder"][lang]} onInput={search}></input>
            </header>
            
            <GameList query={query}/>
        </div>
    );
}

export default Games;