import React, {useState, useEffect} from 'react';
import {fold, getBettingState} from './Api';

function Bet(props){

    const [bet, setBet] = useState(null);
    const [lastUpdate, setLastUpdate] = useState(-1);

    const {game, username, token, latestUpdate, setBettingState} = props;
    
    const bettingState = getBettingState(bet, game.minimum_bet);
    setBettingState(bettingState); 

    useEffect(() => {
        console.log('Prop change')
        //if(lastUpdate >= latestUpdate) return;

        const req = new XMLHttpRequest();
        req.open('GET', `/bets/?username=${username}&game_id=${game.game_id}`, true);
        req.setRequestHeader('auth', token);

        req.send();

        req.onload = () => {
            if(req.status === 200){
                setBet(
                    JSON.parse(req.response)
                );

                setLastUpdate(latestUpdate);
                
            }
        }
    }, [props]);

    if(bet){
        if(bet.folded){
            return <span>Folded</span>
        }
        else{
            return <span className="table-field">{`\"${bet.side}\" for $${bet.amount}`} <button onClick={() => fold(game.game_id, username, token, setBet)}>Fold</button></span>
        }
    }
    else{
        return <span>No Bet</span>
    }
}

export default Bet;