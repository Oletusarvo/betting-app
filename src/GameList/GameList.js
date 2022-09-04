import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import {closeGame, getDestination} from './Api';

function GameList(props){

    const [renderList, setRenderList] = useState([]);
    const [gameList, setGameList] = useState([]);
    const req = new XMLHttpRequest();

    useEffect(() => {
        if(props.username !== undefined){
            req.open('GET', `/games/by_user/${props.username}`, true);
        }
        else{
            req.open('GET', '/games/', true);
        }
    
        req.setRequestHeader('auth', props.token);
        req.send();

        req.onload = () => {
            if(req.status === 200){
                const list = JSON.parse(req.response);
                setGameList(list);
            }
        }
    }, []);

    useEffect(() => {
        let final = [];
        gameList.forEach(item => {
            const div = <div className='container gamelist-container'>
            <Link to={getDestination(props.username, item.game_id) } key={item.game_id}>
                <table>
                    <tbody>
                        <tr>
                            <td>Title:</td>
                            <td className="align-right">{item.game_title}</td>
                        </tr>

                        <tr>
                            <td>Minimum Bet:</td>
                            <td className="align-right">${item.minimum_bet}</td>
                        </tr>

                        <tr>
                            <td>Pool:</td>
                            <td className="align-right">${item.pool.toFixed(2)}</td>
                        </tr>

                        <tr>
                            <td>Expires:</td>
                            <td className="align-right">{item.expiry_date}</td>
                        </tr>

                        <tr>
                            <td>Created By:</td>
                            <td className="align-right">{item.created_by}</td>
                        </tr>
                    </tbody>
                </table>
            </Link>

            {
                props.username ? <button onClick={() => closeGame(item.game_id, props.token, setGameList)}>CLOSE</button> : <></>
            }
            
            </div>
            
            
            final.push(div);
        });

        setRenderList(final);
    }, [gameList])

    return (
        <>
            {renderList}
        </>
    );
}

export default GameList;