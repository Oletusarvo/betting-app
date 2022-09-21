import React, {useContext} from 'react';
import {fold} from './Api';
import AppContext from '../Contexts/AppContext.js';
import GameContext from '../Contexts/GameContext.js';

function Bet(){
    const {user, token, currency} = useContext(AppContext);
    const {setGameState, bet, game} = useContext(GameContext);


    if(bet){
        if(bet.folded){
            return <span>Folded</span>
        }
        else{
            const foldingEnabled = bet.amount == game.minimum_bet;
            return <span className="table-field">{`\"${bet.side}\" for ${currency + bet.amount.toLocaleString('en')}`} <button style={{width: "50px"}}disabled={foldingEnabled} onClick={() => fold(game, bet, token, setGameState)}>Fold</button></span>
        }
    }
    else{
        return <span>No Bet</span>
    }
}

export default Bet;