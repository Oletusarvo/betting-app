import React, {useState, useContext} from 'react';
import {submit} from './Api';
import AppContext from '../Contexts/AppContext.js';
import './Style.scss';

function NewGame(props){
    const [state, setState] = useState({
        loading : true,
        success : false
    });

    const {user, token} = useContext(AppContext);
    
    return (
        <div className="flex-column fill w-100 pad" id="new-game-page">
            <div className="container flex-column glass w-100 bg-fade">
                <div className="align-text-center">
                    <h1>Create new Game</h1>
                </div>
                <div className="sep"></div>
                <form id="new-game-form" onSubmit={(e) => submit(e, user.username, token)}>
                    <input name="title" placeholder="Enter game title" required={true} maxLength={50}></input>
                    <input name="minimumBet" type="number" min="1" step="1" placeholder="Enter minimum bet" required={true}></input>
                    <input name="increment" type="number" min="1" step="1" defaultValue={1} placeholder="Bet Increment"></input>
                    <input name="expiryDate" type="date" placeholder="Enter expiry date"></input>
                    <textarea name="availableTo" maxLength={500} placeholder="Space-separated list of users who will be able to participate."></textarea>
                    <button type="submit">Create</button>
                </form>
            </div>
        </div>
    );
}

export default NewGame;