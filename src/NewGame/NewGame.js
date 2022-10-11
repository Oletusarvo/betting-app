import React, {useState, useContext, useEffect} from 'react';
import CreateGameModal from '../Modals/CreateGame/CreateGameModal.js';
import './Style.scss';

function NewGame(){
    return (
        <div className="flex-column fill w-100 pad" id="new-game-page">
            <CreateGameModal/>
        </div>
    );
}

export default NewGame;