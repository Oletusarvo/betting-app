import '../Style.scss';
import {Link} from 'react-router-dom';
import { useContext } from 'react';
import AppContext from '../../Contexts/AppContext.js';

function GameInfo(props){
    const {game, byUser, destination, setGameList} = props;   
    const {user, socket, setUser, currency} = useContext(AppContext);

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
            setGameList(gameList);
        });
    }

    let options = [];
    game.options?.split(';').forEach(option => options.push(<option key={`option-${option}`}>{option}</option>));
    const isExpired = new Date().getTime() >= new Date(game.expiry_date).getTime();
    const createdBy = game.created_by === user.username;
    return (
        <div className="modal">
            <Link to={destination}>
                <header className="flex-row center-all">{game.game_title}</header>
                <div className={`content glass ${isExpired ?  "bg-expired" : "bg-fade"}`}>
                    <table>
                        <tbody>
                            <tr>
                                <td>Type:</td>
                                <td className="align-text-right">{game.type}</td>
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
                                <td>Pool:</td>
                                <td className="align-text-right">{currency + game.pool.toLocaleString('en')}</td>
                            </tr>
                            
                            <tr>
                                <td>Expires:</td>
                                <td className="align-text-right">{game.expiry_date}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </Link>
            {
                game.created_by === user.username ? 
                <footer className="flex-row fill gap-s">
                    <select hidden={game.type === 'Lottery'} id={`side-select-${game.game_id}`}>
                        {options}
                    </select>
                    <button onClick={() => closeGame(game.game_id, game.type)}>{game.type === 'Lottery' ? 'DRAW' : 'CLOSE'}</button>
                </footer> : <></>
            }
        </div>
    )
}

export default GameInfo;