import React, {useContext} from 'react';
import {fold} from './Api';
import AppContext from '../Contexts/AppContext.js';
import GameContext from '../Contexts/GameContext.js';

function Bet(){
    const {token, currency} = useContext(AppContext);
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
        if(bet.folded){
            return <span>Folded</span>
        }
        else{
            const foldingEnabled = bet.amount == game.minimum_bet;
            return <span className="table-field">{`\"${bet.side}\" for ${currency + bet.amount.toLocaleString('en')}`} <button style={{width: "50px"}}disabled={foldingEnabled} onClick={fold}>Fold</button></span>
        }
    }
    else{
        return <span>No Bet</span>
    }
}

export default Bet;