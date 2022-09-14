import React, {useState, useEffect, useContext} from 'react';
import {Link} from 'react-router-dom';
import {closeGame, getDestination} from './Api';
import AppContext from '../Contexts/AppContext.js';
import Loading from '../Loading/Loading.js';
import './Style.scss';

function GameList(props){

    const [renderList, setRenderList] = useState([]);
    const [gameList, setGameList] = useState(null);
    const {user, token, currency} = useContext(AppContext);
    const req = new XMLHttpRequest();

    useEffect(() => {
        if(props.byUser){
            req.open('GET', `/games/by_user/${user.username}`, true);
        }
        else{
            req.open('GET', '/games/', true);
        }
    
        req.setRequestHeader('auth', token);
        req.send();

        req.onload = () => {
            if(req.status === 200){
                const list = JSON.parse(req.response);
                setGameList(list);
            }
        }
    }, []);

    useEffect(() => {
        if(!gameList) return;
        let final = [];
        gameList.forEach(item => {
            let options = [];
            item.options.split(';').forEach(option => options.push(<option key={`option-${option}`}>{option}</option>));
            
            const div = <div className='container gamelist-container glass w-100 bg-fade'  key={item.game_id}>
            <Link to={getDestination(user.username, item.game_id) }>
                <table>
                    <tbody>
                        <tr>
                            <td>Title:</td>
                            <td className="align-right">{item.game_title}</td>
                        </tr>

                        <tr>
                            <td>Minimum Bet:</td>
                            <td className="align-right">{currency + item.minimum_bet}</td>
                        </tr>

                        <tr>
                            <td>Pool:</td>
                            <td className="align-right">{currency + item.pool}</td>
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
                props.byUser ? 
                <div className="flex-row fill gap-s">
                    <select id={`side-select-${item.game_id}`}>
                        {options}
                    </select>
                    <button onClick={() => closeGame(item.game_id, token, setGameList)}>CLOSE</button>
                </div> : <></>
            }
            
            </div>
            
            
            final.push(div);
        });

        setRenderList(final);
    }, [gameList])

    return (
        <>
            {!gameList ? <Loading title={'Loading gamelist...'}/> : renderList}
        </>
    );
}

export default GameList;