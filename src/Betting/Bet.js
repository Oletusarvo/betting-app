import React, {useContext} from 'react';
import {fold} from './Api';
import AppContext from '../Contexts/AppContext.js';
import GameContext from '../Contexts/GameContext.js';

function Bet({game, bet}){
    const {user, token, currency} = useContext(AppContext);
    const {setGameState} = useContext(GameContext);

    if(bet){
        if(bet.folded){
            return <span>Folded</span>
        }
        else{
            return <span className="table-field">{`\"${bet.side}\" for ${currency + bet.amount.toLocaleString('en')}`} <button onClick={() => fold(game, bet, token, setGameState)}>Fold</button></span>
        }
    }
    else{
        return <span>No Bet</span>
    }
}

export default Bet;