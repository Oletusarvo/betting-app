import React, {useState, useEffect, useContext} from 'react';
import {Link} from 'react-router-dom';
import {getDestination} from './Api';
import AppContext from '../Contexts/AppContext.js';
import GameInfoModal from '../Modals/GameInfo/GameInfoModal.js';
import Loading from '../Loading/Loading.js';
import './Style.scss';

function GameList(props){

    const [renderList, setRenderList] = useState([]);
    const [gameList, setGameList] = useState(null);
    const {user, token, socket} = useContext(AppContext);
    const [loading, setLoading] = useState(false);

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
        setLoading(true);

        req.onload = () => {
            if(req.status === 200){
                const list = JSON.parse(req.response);
                setGameList(list);
                setLoading(false);
            }
        }

        socket.on('error', msg => alert(`Error! ${msg}`));

        return () => {
            socket.off('error');
        }
    }, []);

    useEffect(() => {
        if(!gameList) return;
        let final = [];

        gameList.forEach(item => {
           
            const div = <GameInfoModal key={item.game_id} game={item} destination={getDestination(user.username, item.game_id)} setGameList={setGameList}/>   
            final.push(div);
        });

        setRenderList(final);
    }, [gameList]);

    
    if(loading){
        return <Loading title="Loading gamelist..."/>
    }
    
    return (
        <div className="gap-m flex-column">
            {renderList}
        </div>
    );
}

export default GameList;