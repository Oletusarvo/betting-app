import React, {useState, useEffect, useContext} from 'react';
import {Link} from 'react-router-dom';
import {getDestination} from './Api';
import AppContext from '../Contexts/AppContext.js';
import GameInfoModal from '../Modals/GameInfo/GameInfoModal.js';
import Loading from '../Loading/Loading.js';
import './Style.scss';

function GameList(props){
    const [gameList, setGameList] = useState(null);
    const {user, token, socket} = useContext(AppContext);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const req = new XMLHttpRequest();
        if(props.byUser){
            req.open('GET', `/games/by_user/${user.username}`, true);
        }
        else if(props.query && props.query.length){
            req.open('GET', `/games/?game_title=${props.query}`);
        }
        else{
            req.open('GET', '/games/', true);
        }
    
        req.setRequestHeader('auth', token);
        req.setRequestHeader('Socket_ID', socket.id);
        req.send();
        setLoading(true);

        req.onload = () => {
            if(req.status === 200){
                const list = JSON.parse(req.response);
                list.sort((a, b) => (b.pool + b.pool_reserve) - (a.pool + a.pool_reserve));
                setGameList(list);
                setLoading(false);
            }
        }

        socket.on('error', msg => alert(`Error! ${msg}`));

        return () => {
            socket.off('error');
        }
    }, [props]);

    if(loading){
        return <Loading title="Loading gamelist..."/>
    }
    
    if(!gameList) return null;
    
    return (
        <div className="gap-m flex-column">
            {
                props.byUser ? 
                gameList.filter(item => item.created_by === user.username).map(item => {
                    return <GameInfoModal key={item.game_id} game={item} destination={getDestination(user.username, item.game_id)} setGameList={setGameList}/>
                })
                :
                gameList.map(item => {
                    return <GameInfoModal key={item.game_id} game={item} destination={getDestination(user.username, item.game_id)} setGameList={setGameList}/>
                })
            }
        </div>
    );
}

export default GameList;