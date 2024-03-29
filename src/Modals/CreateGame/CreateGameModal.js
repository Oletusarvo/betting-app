import { useContext, useState } from "react";
import AppContext from "../../Contexts/AppContext.js";
import OptionToken from "./OptionToken/OptionToken.js";
import CreateGameContext from "../../Contexts/CreateGameContex.js";
import '../Style.scss';
import './Style.scss';

function CreateGameModal(){

    const {user, token, currency} = useContext(AppContext);
    const [betTypeSelect, setBetTypeSelect] = useState('Boolean');
    const [options, setOptions] = useState([]);

    function updateSelection(){
        const betSelect = document.querySelector('#select-bet-type');
        setBetTypeSelect(betSelect.value);
    }

    function addOption(e){
        const input = document.querySelector('#option-input');
        const option = input.value;
        const optionAsLowerCase = option.toLowerCase();
        if(option == "" || options.find(item => item.toLowerCase() === optionAsLowerCase)) return;
        setOptions([...options, option]);
        input.value = null;
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
            options : options.join(';'),
        }

        req.send(JSON.stringify(data));
    
        req.onload = () => {
            if(req.status === 200){
                location.assign('/#/games');
            }
            else{
                alert(`Veto hylätty! Syy: ${req.response}`);
            }
        }
    }

    function deleteOption(content){
        const i = options.findIndex(item => item === content);
        if(i != -1) {
            const newOptions = [...options];
            newOptions.splice(i, 1);
            setOptions(newOptions);
        }
    }

    const maxTransfer = Math.abs(Math.floor(user.balance / 2));
    const amountStep = 1 / Math.pow(10, currency.precision);

    return (
        <CreateGameContext.Provider deleteOption={deleteOption}>
        <div className="modal">
                <header>Luo Uusi Veto</header>
                <div className="content glass bg-fade">
                    <form id="new-game-form" onSubmit={submit}>
                        <label>Tyyppi:</label>
                        <select name="betType" id="select-bet-type" onChange={updateSelection}>
                            <option>Boolean</option>
                            <option>Multi-Choice</option>
                        </select>
                        
                    
                        <label>Otsikko:</label>
                        <input 
                            name="title" 
                            placeholder="Anna vedon otsikko" 
                            required={true} 
                            maxLength={50}></input>
                       

                       <label>{betTypeSelect === 'Lottery' ? 'Row Price:' : 'Vähimmäispanos:'}</label>
                        <input 
                            name="minimumBet" 
                            type="number" 
                            min={amountStep} 
                            max={maxTransfer}
                            step={amountStep} 
                            placeholder="Anna vähimmäispanos" 
                            required={true} 
                            defaultValue={1}></input>
        
                        <label hidden={betTypeSelect === 'Lottery'}>Korotus:</label>
                        <input 
                            hidden={betTypeSelect === 'Lottery'} 
                            name="increment" 
                            type="number" 
                            min={betTypeSelect === 'Lottery' ? 1 : 0} 
                            max={maxTransfer}
                            step={amountStep} defaultValue={amountStep} 
                            placeholder="Anna panoksen sallittu korotus" 
                            disabled={betTypeSelect === 'Lottery'}></input>
                        
                        <div className="flex-row gap-s wrap">
                            {
                                options.map(item => {
                                    return (
                                        <OptionToken deleteOption={() => deleteOption(item)} content={item} key={`option-token-${item}`}/>
                                    )
                                })
                            }
                        </div>
                        
                        {
                            betTypeSelect === 'Multi-Choice' ? 
                             <div id="options-input" className="flex-row gap-s center-align" hidden={betTypeSelect !== 'Multi-Choice'}>
                                <input id="option-input" type="text" placeholder="Kirjoita vaihtoehto..." ></input>
                                <button type="button" onClick={addOption}>Lisää</button>
                            </div>
                            : 
                            null
                        }
                       

                        <label>Eräpäivä:</label>
                        <input 
                            name="expiryDate" 
                            type="date" 
                            placeholder="Enter expiry date"></input>
                        <button type="submit">Luo</button>
                    </form>
                </div>
                <footer>
                    
                </footer>
            </div>
        </CreateGameContext.Provider>
        
    );
}

export default CreateGameModal;