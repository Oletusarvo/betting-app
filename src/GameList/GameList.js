import React, {useState, useEffect, useContext} from 'react';
import {getDestination} from './Api';
import AppContext from '../Contexts/AppContext.js';
import GameInfoModal from '../Modals/GameInfo/GameInfoModal.js';
import Loading from '../Loading/Loading.js';
import './Style.scss';
import langStrings from "../lang";
import AddButton from '../Buttons/AddButton/AddButton';


function GameList(props){
    const [gameList, setGameList] = useState(null);
    const {user, token, socket} = useContext(AppContext);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const req = new XMLHttpRequest();
        if(props.byUser){
            req.open('GET', `/games/by_user/${props.byUser}`, true);
        }
        else if(props.byFollowedOf){
            req.open('GET', `/games/?username=${props.byFollowedOf}&followed=true`)
        }
        else if(props.query && props.query.length){
            req.open('GET', `/games/?title=${props.query}`);
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
                const newList = [...list];
                setGameList(newList);
                setLoading(false);
            }
            else{
                console.log('Error loading gamelist');
            }
        }

        socket.on('error', msg => alert(`Error! ${msg}`));

        return () => {
            socket.off('error');
        }
    }, [props.byUser]);

    if(loading){
        return <Loading title='Ladataan vetoja...'/>
    }
    
    if(!gameList || !user) return null;
    
    return (
        <div className="gap-m flex-column">
            {
                gameList.map(item => {
                    return (
                        <>
                        {
                            props.creatorName ?
                            <header className="page-header">
                                <h2>{item.created_by}</h2>
                            </header> : 
                            null

                        }
                        
                        <GameInfoModal key={item.id} game={item} destination={getDestination(user.username, item.id)} setGameList={setGameList}/>

                        </>
                    )
                })
            }
        </div>
    );
}

export default GameList;