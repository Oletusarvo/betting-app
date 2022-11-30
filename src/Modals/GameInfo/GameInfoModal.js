import './Style.scss';
import {Link} from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import AppContext from '../../Contexts/AppContext.js';
import BetBadge from './Badges/BetBadge.js';
import CallBadge from './Badges/CallBadge';
import FoldedBadge from './Badges/FoldedBadge';
import GameInfoTable from './GameInfoTable';

function GameInfoModal(props){
    const {destination, setGameList} = props;   
    const {user, socket, setUser} = useContext(AppContext);

    const [game, setGame] = useState(props.game);
    const [bet, setBet] = useState(null);

    const [mustCall, setMustCall] = useState(false);
    const [isFolded, setIsFolded] = useState(false);
    const [closed, setClosed] = useState(game.closed);

    useEffect(() => {
        const header = document.querySelector(`#header-${game.id}`);
        header.addEventListener('click', () => {

            const body = document.querySelector(`#content-${game.id}`);
            const footer = document.querySelector(`#footer-${game.id}`);
            const header = document.querySelector(`#header-${game.id}`);

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

        socket.emit('bet_get', {username: user.username, id: game.id}, res => {
            if(!res) return;

            if(res.amount < game.minimum_bet) setMustCall(true);
            if(res.folded) setIsFolded(true);

            setBet(res);
        });

        socket.on('game_update', data => {
            if(game.id != data.id) return;

            setGame(data);
            if(bet && bet.amount < game.minimum_bet) setMustCall(true);
        });

        return () => {
            socket.off('game_update');
        }
    }, []);
    
    function toggleClose(){

        socket.emit('game_toggle_close', game.id, res => {
            if(res === undefined) return;
            alert(`${!res ? 'Veto avattu!' : 'Veto suljettu!'}`);
            setClosed(res);
        });
    }

    function endGame(id, type){
        if(typeof(id) !== 'string'){
            throw Error('Game id must be a string!');
        }
    
        const side = document.querySelector(`#side-select-${id}`).value;
        let res;
        res = confirm(`Olet päättämässä vetoa tuloksella \'${side}\'. Oletko varma?`);
        
        if(!res) return;

        const msg = {
            side,
            id,
            username: user.username,
        }

        socket.emit('game_end', msg, update => {
            const {acc, gameList} = update;
            setUser(acc);
            
            setGameList(gameList.sort((a, b) => (b.pool + b.pool_reserve) - (a.pool - a.pool_reserve)));
        });
    }

    let options = [];
    game.options?.split(';').forEach(option => options.push(<option key={`option-${option}`}>{option}</option>));
    const isExpired = new Date().getTime() >= new Date(game.expiry_date).getTime();

    return (
        <>
        <div className="modal game-info-modal w-100">
            <header className={`flex-row center-all game-info-header`} id={`header-${game.id}`}>
                {game.title} 
                {!isFolded && mustCall ? <CallBadge/> : isFolded ? <FoldedBadge/> : bet ? <BetBadge/> : null}
            </header>

            <div className={`content glass ${isExpired ?  "bg-expired" : "bg-fade"}`}  id={`content-${game.id}`}>
                <Link to={destination}>
                    <GameInfoTable game={game}/>
                </Link>
            </div>
            
            <footer className="flex-row fill gap-s" id={`footer-${game.id}`}>
                {
                    game.created_by === user.username ? 
                    <>
                        <select disabled={game.expiry_date !== 'When Closed' && !isExpired} hidden={game.type === 'Lottery'} id={`side-select-${game.id}`}>
                            {options}
                        </select>
                        <button onClick={toggleClose}>{closed ? 'AVAA' : 'SULJE'}</button>
                        <button disabled={game.expiry_date !== 'When Closed' && !isExpired && game.type !== 'Lottery'} onClick={() => endGame(game.id, game.type)}>{game.type === 'Lottery' ? 'DRAW' : 'PÄÄTÄ'}</button>
                    </>
                    :
                    null
                }
            </footer>
            
        </div>

        </>
    )
}

export default GameInfoModal;