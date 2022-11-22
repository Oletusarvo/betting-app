import React, {useContext} from 'react';
import AppContext from '../Contexts/AppContext.js';
import GameContext from '../Contexts/GameContext.js';
import Currency from '../currency';
import langStrings from "../lang";

function Bet(){
    const {token, currency, currencyPrecision, lang} = useContext(AppContext);
    const {setGameState, bet, game} = useContext(GameContext);

    function fold(){
        const req = new XMLHttpRequest();
        req.open('POST', '/bets/fold', true);
        req.setRequestHeader('Content-Type', 'application/json');
        req.setRequestHeader('auth', token);
    
        const data = {
            id : game.id,
            username : bet.username,
        }
    
        req.send(JSON.stringify(data));
    
        req.onload = () => {
            if(req.status === 200){
                const bet = JSON.parse(req.response);
                const newState = {
                    game, bet
                };
                setGameState(newState);
            }
        }
    }
    
    

    if(bet){
        const amount = new Currency(bet.amount, currencyPrecision).getAsString('en');
        if(bet.folded){
            return <span>{langStrings["game-info-folded"][lang]}</span>
        }
        else{
            const foldingEnabled = bet.amount == game.minimum_bet;
            return <span className="table-field">{`\"${bet.side}\" ${langStrings["game-info-bidfor"][lang]} ${currency + amount}`} <button style={{width: "50px"}}disabled={foldingEnabled} onClick={fold}>{langStrings["fold-button"][lang]}</button></span>
        }
    }
    else{
        return <span>{langStrings["game-info-nobid"][lang]}</span>
    }
}

export default Bet;