import React, {useState} from 'react';
import {submit} from './Api';

function NewGame(props){
    const [state, setState] = useState({
        loading : true,
        success : false
    });

    return (
        <div className="page" id="new-game-page">
            <h1>Create new Game</h1>
            <form id="new-game-form" onSubmit={(e) => submit(e, props.username, props.token)}>
                <input name="title" placeholder="Enter game title" required={true} maxLength={50}></input>
                <input name="minimumBet" type="number" min="0.01" step="0.01" placeholder="Enter minimum bet" required={true}></input>
                <input name="increment" type="number" min="0.01" step="0.01" defaultValue={0.01} placeholder="Bet Increment"></input>
                <input name="expiryDate" type="date" placeholder="Enter expiry date"></input>
                <textarea name="availableTo" maxLength={500} placeholder="Space-separated list of users who will be able to participate."></textarea>
                <button type="submit">Create</button>
            </form>
        </div>
    );
}

export default NewGame;