import { useContext } from 'react';
import AppContext from '../Contexts/AppContext.js';
import GameContext from '../Contexts/GameContext.js';
import Currency from '../currency';

function Pool(){
    const {bet, game, isExpired} = useContext(GameContext);
    const {currency} = useContext(AppContext);

    function getBettingState(){
        if(bet == undefined){
            return 'entry';
        }
        else if(bet && !bet.folded && bet.amount < game.minimum_bet){
            return 'call';
        }
        else{
            return 'set';
        }
    }

    const totalPool = currency.getString(game.pool + game.pool_reserve)

    return (
        <div className={"container glass bg-fade " + (isExpired && "bg-expired")} id="bet-pool">
            <div id="bet-pool-ring" className={getBettingState()}>
                <h1>{totalPool}</h1>
            </div>
        </div>
    );
}

export default Pool;