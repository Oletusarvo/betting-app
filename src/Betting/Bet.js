import React, {useState, useEffect, useContext} from 'react';
import {fold, getBettingState} from './Api';
import AppContext from '../Contexts/AppContext.js';
import GameContext from '../Contexts/GameContext.js';

function Bet(props){
    const [bet, setBet] = useState();
    const {user, token} = useContext(AppContext);
    const {game, setBettingState} = useContext(GameContext);

    useEffect(() => {
        const req = new XMLHttpRequest();
        req.open('GET', `/bets/?username=${user.username}&game_id=${game.game_id}`, true);
        req.setRequestHeader('auth', token);

        req.send();

        req.onload = () => {
            if(req.status === 200){
                if(req.response === "") return;
                const res = JSON.parse(req.response);
                setBet(res);
                
            }
        }
    }, [props]);

    useEffect(() => {
        const bettingState = getBettingState(bet, game.minimum_bet);
        setBettingState(bettingState); 
    }, [bet]);

    if(bet){
        if(bet.folded){
            return <span>Folded</span>
        }
        else{
            return <span className="table-field">{`\"${bet.side}\" for $${bet.amount.toFixed(2)}`} <button onClick={() => fold(game.game_id, user.username, token, setBet)}>Fold</button></span>
        }
    }
    else{
        return <span>No Bet</span>
    }
}

export default Bet;