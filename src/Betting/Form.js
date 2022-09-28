import { useContext, useEffect } from "react";
import AppContext from "../Contexts/AppContext.js";
import GameContext from "../Contexts/GameContext.js";

function Form(){
    const {user, token, socket} = useContext(AppContext);
    const {isExpired, game, bet, placeBet, raise, call} = useContext(GameContext);
    const minBet = bet ? game.minimum_bet - bet.amount : game.minimum_bet;
    
    let options = game.options.split(';');
    let renderOptions = [];
    options.forEach(option => renderOptions.push(
        <option key={`option-${option}`} value={option}>{option}</option>
    ));
    
    return (
        <div id="bet-controls" className={"container glass gap-s bg-fade " + (isExpired && " bg-expired")}>
            <select id="bet-options">{renderOptions}</select>
            <button id="bet-button" onClick={bet ? call : placeBet}>{bet ? "Call" : "Bet"}</button>
            <button id="raise-button" onClick={raise}>Raise</button>
        </div>
    );
}

export default Form;