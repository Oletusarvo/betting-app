import React, {useState, useEffect, useContext} from 'react';
import ReactDOM from 'react-dom';

import {useParams, useNavigate, Link} from 'react-router-dom';
import Loading from '../Loading/Loading.js';
import {placeBet, submit, fold, call, loadGame} from './Api';
import Bet from './Bet';
import Balance from '../Balance/Balance.js';
import AppContext from '../Contexts/AppContext.js';
import GameContext from '../Contexts/GameContext.js';
import Dialog from '../Dialog/Dialog.js';

import './Style.scss';

function Betting(props) {
    const {game_id} = useParams();
    const {user, token, socket, currency} = useContext(AppContext);

    const [game, setGame] = useState();
    const [bettingState, setBettingState] = useState('entry');
    const [minBet, setMinBet] = useState(0);

    useEffect(() => {
        loadGame(game_id, token).then(data => setGame(data));
        socket.on('game_update', data => {
            setGame(JSON.parse(data));
        });
    }, []);

    if(!game){
        return <Loading title="Loading game..." />
    }
    else{
        let options = game.options.split(';');
        let renderOptions = [];
        options.forEach(option => renderOptions.push(
            <option key={`option-${option}`}>{option}</option>
        ));

        return (
            <div className="flex-column fill gap-default w-100 center-align pad overflow-y-scroll" id="betting-page">
            <div className="betting-container container glass bg-fade" id="bet-title">
                <Link id="back-button" to="/games">
                    <img src="../img/arrow.png"></img>
                </Link>
                <h3 id="bet-name">{game.game_title}</h3>
            </div>

            <div className="betting-container container glass bg-fade" id="bet-info">
                <table>
                    <tbody>
                        <tr>
                            <td>Your Balance:</td>
                            <td className="align-text-right"><Balance/></td>
                        </tr>

                        <tr>
                            <td>Your Bet:</td>
                            <td className="align-text-right">
                                <GameContext.Provider value={{game, setBettingState, setMinBet}}>
                                    <Bet/>
                                </GameContext.Provider>
                                
                                </td>
                        </tr>
                        <tr>
                            <td>Minimum Bet: </td>
                            <td className="align-text-right">{currency + game.minimum_bet.toLocaleString('en')}</td>
                        </tr>

                        <tr>
                            <td>Increment:</td>
                            <td className="align-text-right">{currency + game.increment.toLocaleString('en')}</td>
                        </tr>

                        <tr>
                            <td>Expiry Date:</td>
                            <td className="align-text-right">{game.expiry_date}</td>
                        </tr>

                        <tr>
                            <td>Time Left:</td>
                            <td className="align-text-right">
                                {game.expiry_date != 'When Closed' ? Math.round((new Date(game.expiry_date) - new Date()) / 1000 / 60 / 60 / 24) + ' days' : 'No Limit'}
                                
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className="betting-container container glass bg-fade" id="bet-pool">
                <div id="bet-pool-ring" className={bettingState}>
                    <h1>{currency + game.pool.toLocaleString('en')}</h1>
                </div>
            </div>
            <div className="betting-container container glass bg-fade" id="bet-controls">
                <form id="betting-form" onSubmit={(e) => submit(e, token, user.username, game.game_id)}>
                    <input type="number" name="amount" placeholder="Bet Amount" min={minBet} defaultValue={minBet} step={game.increment}></input>
                    <select name="side">
                        {renderOptions}
                    </select>
                    <button type="submit">Place Bet</button>
                </form>
            </div>
        </div>
        );
    }
}

export default Betting;