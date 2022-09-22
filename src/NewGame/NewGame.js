import React, {useState, useContext, useEffect} from 'react';
import {submit} from './Api';
import AppContext from '../Contexts/AppContext.js';
import './Style.scss';

function NewGame(props){
    const [betTypeSelect, setBetTypeSelect] = useState('Boolean');

    const {user, token} = useContext(AppContext);

    function updateSelection(){
        const betSelect = document.querySelector('#select-bet-type');
        if(betSelect.value === 'Boolean'){
            setBetTypeSelect('Boolean');
        }
        else if(betSelect.value === 'Multi-Choice'){
            setBetTypeSelect('Multi-Choice');
        }
        else if(betSelect.value === 'Lottery'){
            setBetTypeSelect('Lottery');
        }
    }

    return (
        <div className="flex-column fill w-100 pad" id="new-game-page">
            <div className="container glass">
                <div className="align-text-center">
                    <h1>Create new Game</h1>
                </div>
                <div className="sep"></div>
                <form id="new-game-form" onSubmit={(e) => submit(e, user.username, token)}>
                    <label>Type:</label>
                    <select name="betType" id="select-bet-type" onChange={updateSelection}>
                        <option>Boolean</option>
                        <option>Multi-Choice</option>
                        <option>Lottery</option>
                    </select>

                    <label>Title:</label>
                    <input name="title" placeholder="Enter game title" required={true} maxLength={50}></input>

                    <label>{betTypeSelect === 'Lottery' ? 'Row Price:' : 'Minimum Bet:'}</label>
                    <input name="minimumBet" type="number" min="1" step="1" placeholder="Enter minimum bet" required={true}></input>

                    <label hidden={betTypeSelect === 'Lottery'}>Increment:</label>
                    <input hidden={betTypeSelect === 'Lottery'} name="increment" type="number" min="1" step="1" defaultValue={1} placeholder="Bet Increment" disabled={betTypeSelect === 'Lottery'}></input>
                    
                    <label hidden={betTypeSelect !== 'Lottery'}>Row Size:</label>
                    <input hidden={betTypeSelect !== 'Lottery'} name="rowSize" defaultValue="4" min="2" step="1" max="7" type="number" placeholder='Enter preferred row size'></input>
                    
                    <textarea id="input-bet-options" name="betOptions" placeholder="Multi-choice bet options separated by semi-colon(;)" maxLength={256} disabled={betTypeSelect === 'Multi-Choice' ? false : true}></textarea>
                    <label>Expiry Date:</label>
                    <input name="expiryDate" type="date" placeholder="Enter expiry date"></input>
                    <button type="submit">Create</button>
                </form>
            </div>
        </div>
    );
}

export default NewGame;