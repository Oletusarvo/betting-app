import React, {useState, useContext, useEffect} from 'react';
import CreateGame from '../Modals/CreateGame/CreateGame.js';
import AppContext from '../Contexts/AppContext.js';
import './Style.scss';

function NewGame(props){
    return (
        <div className="flex-column fill w-100 pad" id="new-game-page">
            <CreateGame/>
        </div>
    );
}

export default NewGame;