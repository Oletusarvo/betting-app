import React, {useState, useEffect} from 'react';
import {useParams, useNavigate, Link} from 'react-router-dom';
import Loading from '../loading';
import {placeBet, submit, fold} from './Api';
import Bet from './Bet';
import Balance from '../Balance/Balance.js';

function Betting(props) {
    const {game_id} = useParams();
    const [game, setGame] = useState(null);
    const [latestUpdate, setLatestUpdate] = useState(0);
    const [bettingState, setBettingState] = useState('entry');

    const [socket, setSocket] = useState(io());

    socket.on('game_update', data => {
        const game = JSON.parse(data);
        setGame(game);
        setLatestUpdate(new Date().getTime());
    });

    useEffect(() => {
        const req = new XMLHttpRequest();
        req.open('GET', `/games/${game_id}`, true);
        req.setRequestHeader('auth', props.token);
        req.setRequestHeader('Content-Type', 'application/json');
        req.send();

        req.onload = () => {
            if(req.status === 200){
                setGame(JSON.parse(req.response));
            }
        }
    }, []);

    if(game === null){
        return <Loading title="Loading game..." />
    }
    else{
        return (
            <div className="page" id="betting-page">
                <div className="betting-container container" id="bet-title">
                    <Link id="back-button" to="/games">
                        <img src="../img/arrow.png"></img>
                    </Link>
                    <h3 id="bet-name">{game.game_title}</h3>
                </div>

                <div className="betting-container container" id="bet-info">
                    <table>
                        <tbody>
                            <tr>
                                <td>Your Balance:</td>
                                <td className="align-right"><Balance username={props.user.username} token={props.token}/></td>
                            </tr>

                            <tr>
                                <td>Your Bet:</td>
                                <td className="align-right"><Bet username={props.user.username} token={props.token} game={game} latestUpdate={latestUpdate} setBettingState={setBettingState}/></td>
                            </tr>
                            <tr>
                                <td>Minimum Bet: </td>
                                <td className="align-right">${game.minimum_bet.toFixed(2)}</td>
                            </tr>

                            <tr>
                                <td>Increment:</td>
                                <td className="align-right">${game.increment.toFixed(2)}</td>
                            </tr>

                            <tr>
                                <td>Expiry Date:</td>
                                <td className="align-right">{game.expiry_date}</td>
                            </tr>

                            <tr>
                                <td>Time Left:</td>
                                <td className="align-right">
                                    {game.expiry_date != 'When Closed' ? Math.round((new Date(game.expiry_date) - new Date()) / 1000 / 60 / 60 / 24) + ' days' : 'No Limit'}
                                    
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="betting-container container" id="bet-pool">
                    <div id="bet-pool-ring" className={bettingState} onClick={() => call(bettingState)}>
                       <h1>${game.pool.toFixed(2)}</h1>
                    </div>
                </div>
                <div className="betting-container container" id="bet-controls">
                    <form id="betting-form" onSubmit={(e) => submit(e, props.token, props.user.username, game.game_id, setGame)}>
                        <input type="number" name="amount" placeholder="Bet Amount" min="0.00" step={game.increment}></input>
                        <select name="side">
                            <option>Kyllä</option>
                            <option>Ei</option>
                        </select>
                        <button type="submit">Place Bet</button>
                    </form>
                </div>
            </div>
        );
    }
}

export default Betting;