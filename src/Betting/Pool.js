import { useContext } from 'react';
import AppContext from '../Contexts/AppContext.js';
import GameContext from '../Contexts/GameContext.js';
import Currency from '../currency';

function Pool(){
    const {bet, game, isExpired} = useContext(GameContext);
    const {currency, currencyPrecision} = useContext(AppContext);

    function getBettingState(){
        if(bet == undefined){
            return 'entry';
        }
        else if(bet && !bet.folded && Math.round(bet.amount) < Math.round(game.minimum_bet)){
            return 'call';
        }
        else{
            return 'set';
        }
    }

    const totalPool = new Currency(game.pool + game.pool_reserve, currencyPrecision).getAsString('en');

    return (
        <div className={"container glass bg-fade " + (isExpired && "bg-expired")} id="bet-pool">
            <div id="bet-pool-ring" className={getBettingState()}>
                <h1>{currency + totalPool}</h1>
            </div>
        </div>
    );
}

export default Pool;