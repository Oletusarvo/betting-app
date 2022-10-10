import { useContext, useEffect } from "react";
import AppContext from "../Contexts/AppContext.js";
import GameContext from "../Contexts/GameContext.js";

function Form(){
    const {isExpired, game, bet, placeBet, raise, call} = useContext(GameContext);
    
    let options = game.options.split(';');
    let renderOptions = [];
    options.forEach(option => renderOptions.push(
        <option key={`option-${option}`} value={option}>{option}</option>
    ));
    
    return (
        <div id="bet-controls" className={"container glass gap-s bg-fade " + (isExpired && " bg-expired")}>
            <select id="bet-options" disabled={bet && bet.folded}>{renderOptions}</select>
            <button id="bet-button" onClick={bet ? call : placeBet} disabled={ bet && bet.folded}>{bet ? "Call" : "Bet"}</button>
            <button id="raise-button" onClick={raise} disabled={game.increment == 0 || (bet && bet.folded)}>Raise</button>
        </div>
    );
}

export default Form;