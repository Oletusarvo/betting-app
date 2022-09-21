import React, {useState, useEffect, useContext} from 'react';
import {Link} from 'react-router-dom';
import {getDestination} from './Api';
import AppContext from '../Contexts/AppContext.js';
import Loading from '../Loading/Loading.js';
import './Style.scss';

function GameList(props){

    const [renderList, setRenderList] = useState([]);
    const [gameList, setGameList] = useState(null);
    const {user, token, currency, socket, setUser} = useContext(AppContext);

    function closeGame(game_id){
        if(typeof(game_id) !== 'string'){
            throw Error('Game id must be a string!');
        }
    
        const side = document.querySelector(`#side-select-${game_id}`).value;
    
        const res = confirm(`You are about to close the game on \'${side}\'. Are you sure?`);
    
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

    useEffect(() => {
        const req = new XMLHttpRequest();
        if(props.byUser){
            req.open('GET', `/games/by_user/${user.username}`, true);
        }
        else{
            req.open('GET', '/games/', true);
        }
    
        req.setRequestHeader('auth', token);
        req.setRequestHeader('Socket_ID', socket.id);
        req.send();

        req.onload = () => {
            if(req.status === 200){
                const list = JSON.parse(req.response);
                setGameList(list);
            }
        }

        socket.on('game_close_error', msg => alert(`Error! ${msg}`));

        return () => {
            socket.off('game_close_error');
        }
    }, []);

    useEffect(() => {
        if(!gameList) return;
        let final = [];

        gameList.forEach(item => {
            let options = [];
            item.options.split(';').forEach(option => options.push(<option key={`option-${option}`}>{option}</option>));
            const isExpired = new Date().getTime() >= new Date(item.expiry_date).getTime();
            const div = <div className={`gamelist-container container glass ${isExpired && 'bg-expired'}`}  key={item.game_id}>
            <Link to={getDestination(user.username, item.game_id) }>
                <table>
                    <tbody>
                        <tr>
                            <td>Title:</td>
                            <td className="align-text-right">{item.game_title}</td>
                        </tr>

                        <tr>
                            <td>Minimum Bet:</td>
                            <td className="align-text-right">{currency + item.minimum_bet.toLocaleString('en')}</td>
                        </tr>

                        <tr>
                            <td>Pool:</td>
                            <td className="align-text-right">{currency + item.pool.toLocaleString('en')}</td>
                        </tr>

                        <tr>
                            <td>Expires:</td>
                            <td className="align-text-right">{item.expiry_date}</td>
                        </tr>

                        <tr>
                            <td>Created By:</td>
                            <td className="align-text-right">{item.created_by}</td>
                        </tr>
                    </tbody>
                </table>
            </Link>

            {
                props.byUser ? 
                <div className="flex-row fill gap-s">
                    <select id={`side-select-${item.game_id}`}>
                        {options}
                    </select>
                    <button onClick={() => closeGame(item.game_id)}>CLOSE</button>
                </div> : <></>
            }
            
            </div>
            
            
            final.push(div);
        });

        setRenderList(final);
    }, [gameList]);

    

    return (
        <>
            {!gameList ? <Loading title={'Loading gamelist...'}/> : renderList}
        </>
    );
}

export default GameList;