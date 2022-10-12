import { useContext, useState } from "react";
import AppContext from "../../Contexts/AppContext.js";
import '../Style.scss';

function CreateGameModal(){

    const {user, token} = useContext(AppContext);
    const [betTypeSelect, setBetTypeSelect] = useState('Boolean');

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

    function submit(e){
        e.preventDefault();
    
        const req = new XMLHttpRequest();
        req.open('POST', '/games', true);
        req.setRequestHeader('auth', token);
        req.setRequestHeader('Content-Type', 'application/json');
    
        const form = document.querySelector('#new-game-form');
        const data = {
            title : form.title.value,
            minimum_bet : form.minimumBet.valueAsNumber,
            increment : form.increment.valueAsNumber,
            created_by : user.username,
            expiry_date : form.expiryDate.value,
            type : form.betType.value,
            options : form.betOptions.value,
            lotto_row_size: form.rowSize.value,
        }
        
        const balance = Math.abs(user.balance);
        if(data.increment > balance || data.minimum_bet > balance){
            alert('Maximum increment or minimum bet can only be as much as your absolute balance!');
            return;
        }
        
        req.send(JSON.stringify(data));
    
        req.onload = () => {
            if(req.status === 200){
                location.assign('/#/games');
            }
            else{
                alert(`Game rejected! Reason: ${req.response}`);
            }
        }
    }

    return (
        <div className="modal">
            <header>Create New Game</header>
            <div className="content glass bg-fade">
                <form id="new-game-form" onSubmit={submit}>
                    <label>Type:</label>
                    <select name="betType" id="select-bet-type" onChange={updateSelection}>
                        <option>Boolean</option>
                        <option>Multi-Choice</option>
                    </select>

                    <label>Title:</label>
                    <input name="title" placeholder="Enter game title" required={true} maxLength={50}></input>

                    <label>{betTypeSelect === 'Lottery' ? 'Row Price:' : 'Minimum Bet:'}</label>
                    <input name="minimumBet" type="number" min="1" step="1" placeholder="Enter minimum bet" required={true} defaultValue={1}></input>
                    
                    <label hidden={betTypeSelect === 'Lottery'}>Increment:</label>
                    <input hidden={betTypeSelect === 'Lottery'} name="increment" type="number" min={betTypeSelect === 'Lottery' ? 1 : 0} step="1" defaultValue={1} placeholder="Bet Increment" disabled={betTypeSelect === 'Lottery'}></input>
                    
                    <label hidden={betTypeSelect !== 'Lottery'}>Row Size:</label>
                    <input hidden={betTypeSelect !== 'Lottery'} name="rowSize" defaultValue="4" min="1" step="1" max="7" type="number" placeholder='Enter preferred row size'></input>
                    
                    <textarea id="input-bet-options" name="betOptions" placeholder="Multi-choice bet options separated by semi-colon(;)" maxLength={256} disabled={betTypeSelect !== 'Multi-Choice'} required={true}></textarea>
                    <label>Expiry Date:</label>
                    <input name="expiryDate" type="date" placeholder="Enter expiry date"></input>
                    <button type="submit">Create</button>
                </form>
            </div>
            <footer>
                
            </footer>
        </div>
    );
}

export default CreateGameModal;