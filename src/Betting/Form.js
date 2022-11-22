import { useContext } from "react";
import AppContext from "../Contexts/AppContext.js";
import GameContext from "../Contexts/GameContext.js";
import langStrings from "../lang";

function Form(){
    const {isExpired, game, bet, placeBet, raise, call} = useContext(GameContext);
    const {lang} = useContext(AppContext);
    
    let options = game.options.split(';');
    let renderOptions = [];
    options.forEach(option => renderOptions.push(
        <option key={`option-${option}`} value={option}>{option}</option>
    ));
    
    const bidButtonText = langStrings["bid-button"][lang];
    const callButtonText = langStrings["call-button"][lang];
    const raiseButtonText = langStrings["raise-button"][lang];

    return (
        <div id="bet-controls" className={"container glass gap-s bg-fade " + (isExpired && " bg-expired")}>
            <select id="bet-options" disabled={bet && bet.folded}>{renderOptions}</select>
            <button id="bet-button" onClick={bet ? call : placeBet} disabled={ bet && bet.folded}>{bet ? callButtonText : bidButtonText}</button>
            <button id="raise-button" onClick={raise} disabled={game.increment == 0 || (bet && bet.folded)}>{raiseButtonText}</button>
        </div>
    );
}

export default Form;