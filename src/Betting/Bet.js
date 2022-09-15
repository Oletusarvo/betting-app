import React, {useState, useEffect, useContext} from 'react';
import {fold, getBettingState, loadBet} from './Api';
import AppContext from '../Contexts/AppContext.js';
import GameContext from '../Contexts/GameContext.js';

function Bet(props){
    const {user, token, currency} = useContext(AppContext);
    const {game, setBettingState, setMinBet} = useContext(GameContext);
    const [bet, setBet] = useState();

    useEffect(() => {
        loadBet(user.username, game.game_id, token).then(data => setBet(data));
    }, [props]);

    useEffect(() => {
        const bettingState = getBettingState(bet, game.minimum_bet);
        setBettingState(bettingState); 
        if(bet) {
            setMinBet(game.minimum_bet - bet.amount);
        }
        else{
            setMinBet(game.minimum_bet);
        }
    }, [bet]);

    if(bet){
        if(bet.folded){
            return <span>Folded</span>
        }
        else{
            return <span className="table-field">{`\"${bet.side}\" for ${currency + bet.amount.toLocaleString('en')}`} <button onClick={() => fold(game.game_id, user.username, token, setBet)}>Fold</button></span>
        }
    }
    else{
        return <span>No Bet</span>
    }
}

export default Bet;