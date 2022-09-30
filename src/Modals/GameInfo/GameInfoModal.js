import './Style.scss';
import {Link} from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import AppContext from '../../Contexts/AppContext.js';
import BetBadge from './Badges/BetBadge.js';
import CallBadge from './Badges/CallBadge';
import FoldedBadge from './Badges/FoldedBadge';

function GameInfoModal(props){
    const {destination, setGameList} = props;   
    const {user, socket, setUser, currency} = useContext(AppContext);

    const [game, setGame] = useState(props.game);
    const [bet, setBet] = useState(null);
    const [mustCall, setMustCall] = useState(false);
    const [isFolded, setIsFolded] = useState(false);

    useEffect(() => {
        socket.emit('bet_get', {username: user.username, game_id: game.game_id}, res => {
            if(!res) return;

            if(res.amount < game.minimum_bet) setMustCall(true);
            if(res.folded) setIsFolded(true);

            setBet(res);
        });

        socket.on('game_update', data => {
            if(game.game_id != data.game_id) return;

            setGame(data);
            if(res.amount < game.minimum_bet) setMustCall(true);
        });

        const header = document.querySelector(`#header-${game.game_id}`);
        header.addEventListener('click', () => {

            const body = document.querySelector(`#content-${game.game_id}`);
            const footer = document.querySelector(`#footer-${game.game_id}`);
            const header = document.querySelector(`#header-${game.game_id}`);

            if(body.classList.contains('open')){
                body.classList.remove('open');
                footer.classList.remove('open');
                header.classList.remove('open');
            }
            else{
                body.classList.add('open');
                footer.classList.add('open');
                header.classList.add('open');
            }
        });

        return () => {
            socket.off('game_update');
        }
    }, []);

    function closeGame(game_id, type){
        if(typeof(game_id) !== 'string'){
            throw Error('Game id must be a string!');
        }
    
        const side = document.querySelector(`#side-select-${game_id}`).value;
        let res;

        if(type !== 'Lottery'){
            res = confirm(`You are about to close the game on \'${side}\'. Are you sure?`);
        }
        else{
            res = confirm(`You are about draw the lottery. Are you sure?`);
        }
        
    
        if(!res) return;

        const msg = {
            side,
            game_id,
            username: user.username,
        }

        socket.emit('game_close', msg, (update) => {
            const {acc, gameList} = update;
            setUser(acc);
            setGameList(gameList.sort((a, b) => (b.pool + b.pool_reserve) - (a.pool - a.pool_reserve)));
        });
    }

    let options = [];
    game.options?.split(';').forEach(option => options.push(<option key={`option-${option}`}>{option}</option>));
    const isExpired = new Date().getTime() >= new Date(game.expiry_date).getTime();

    return (
        <div className="modal game-info-modal">
            <header className={`flex-row center-all`} id={`header-${game.game_id}`}>
                {game.game_title} 
                {!isFolded && mustCall ? <CallBadge/> : isFolded ? <FoldedBadge/> : bet ? <BetBadge/> : null}
            </header>
                <div className={`content glass ${isExpired ?  "bg-expired" : "bg-fade"}`}  id={`content-${game.game_id}`}>
                    <Link to={destination}>
                        <table>
                            <tbody>
                                <tr>
                                    <td>Type:</td>
                                    <td className="align-text-right">{game.type}</td>
                                </tr>

                                <tr>
                                    <td>Pool:</td>
                                    <td className="align-text-right">{currency + (game.pool + game.pool_reserve).toLocaleString('en')}</td>
                                </tr>

                                {
                                    game.type === 'Lottery' && <tr>
                                        <td>Row Size:</td>
                                        <td className="align-text-right">{game.row_size}</td>
                                    </tr>
                                }
                                <tr>
                                    <td>{game.type === "Lottery" ? "Row Price:" : "Minimum Bet:"}</td>
                                    <td className="align-text-right">{currency + game.minimum_bet.toLocaleString('en')}</td>
                                </tr>
                                
                                
                                
                                <tr>
                                    <td>Expires:</td>
                                    <td className="align-text-right">{game.expiry_date}</td>
                                </tr>
                            </tbody>
                        </table>
                    </Link>
                </div>

            
            <footer className="flex-row fill gap-s" id={`footer-${game.game_id}`}>
                {
                    game.created_by === user.username ? 
                    <>
                        <select disabled={game.expiry_date !== 'When Closed' && !isExpired} hidden={game.type === 'Lottery'} id={`side-select-${game.game_id}`}>
                            {options}
                        </select>
                        <button disabled={game.expiry_date !== 'When Closed' && !isExpired && game.type !== 'Lottery'} onClick={() => closeGame(game.game_id, game.type)}>{game.type === 'Lottery' ? 'DRAW' : 'CLOSE'}</button>
                    </>
                    :
                    null
                }
            </footer>
            
        </div>
    )
}

export default GameInfoModal;