import React, {useState, useEffect, useContext} from 'react';
import {Link} from 'react-router-dom';
import {getDestination} from './Api';
import AppContext from '../Contexts/AppContext.js';
import GameInfo from '../Modals/GameInfo/GameInfo.js';
import Loading from '../Loading/Loading.js';
import './Style.scss';

function GameList(props){

    const [renderList, setRenderList] = useState([]);
    const [gameList, setGameList] = useState(null);
    const {user, token, socket} = useContext(AppContext);

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

        socket.on('error', msg => alert(`Error! ${msg}`));

        return () => {
            socket.off('error');
        }
    }, []);

    useEffect(() => {
        if(!gameList) return;
        let final = [];

        gameList.forEach(item => {
           
            const div = <GameInfo game={item} destination={getDestination(user.username, item.game_id)} setGameList={setGameList}/>   
            final.push(div);
        });

        setRenderList(final);
    }, [gameList]);

    

    return (
        <div className="gap-m flex-column">
            {!gameList ? <Loading title={'Loading gamelist...'}/> : renderList}
        </div>
    );
}

export default GameList;