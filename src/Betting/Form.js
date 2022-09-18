import { useContext } from "react";
import AppContext from "../Contexts/AppContext.js";
import GameContext from "../Contexts/GameContext.js";
import {submit} from './Api.js';

function Form(){
    const {user, token} = useContext(AppContext);
    const {isExpired, game, bet} = useContext(GameContext);
    const minBet = bet ? game.minimum_bet - bet.amount : game.minimum_bet;
    
    let options = game.options.split(';');
    let renderOptions = [];
    options.forEach(option => renderOptions.push(
        <option key={`option-${option}`}>{option}</option>
    ));
    
    console.log(minBet);
    
    return (
        <div className={"container glass " + (isExpired && " bg-expired")} id="bet-controls">
            <form id="betting-form" onSubmit={(e) => submit(e, token, user.username, game.game_id)}>
                <input type="number" name="amount" placeholder="Bet Amount" min={minBet} defaultValue={minBet} step={game.increment}></input>
                <select name="side">
                    {renderOptions}
                </select>
                <button type="submit">Place Bet</button>
            </form>
        </div>
    );
}

export default Form;