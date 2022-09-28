import { useContext } from 'react';
import AppContext from '../Contexts/AppContext.js';
import GameContext from '../Contexts/GameContext.js';
import {getBettingState} from './Api.js';

function Pool(){
    const {bet, game, isExpired} = useContext(GameContext);
    const {currency} = useContext(AppContext);

    return (
        <div className={"container glass bg-fade " + (isExpired && "bg-expired")} id="bet-pool">
            <div id="bet-pool-ring" className={getBettingState(bet, game.minimum_bet)}>
                <h1>{currency + game.pool.toLocaleString('en')}</h1>
            </div>
        </div>
    );
}

export default Pool;