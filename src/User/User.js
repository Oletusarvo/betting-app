import AppContext from "../Contexts/AppContext"
import {useContext, useEffect, useState} from 'react';
import GameList from "../GameList/GameList";
import './Style.scss';
import { useParams } from "react-router-dom";
import Loading from "../Loading/Loading";

function User(props){

    const {username} = useParams();
    const {socket, user} = useContext(AppContext);
    const [data, setData] = useState({
        numBets: 0,
        numFollowers: 0,
        numFollowing: 0,
    });

    useEffect(() => {
        socket.emit('get_user_data', username, dataUpdate => {
            if(!dataUpdate) return;
            setData(dataUpdate);
        })
    }, [username]);

    function follow(){
        socket.emit('follow', user.username, username, res => {
            if(!res) return;
            console.log(res);
        })
    }

    if(user === null) return <Loading message="Ladataan käyttäjää..."/>

    return (
        <div className="page" id="user-page">
            <header id="user-page-header" className="margin-bottom">
                <div id="user-details">
                    <h2 id="user-icon">{username[0]}</h2>
                    <div className="user-header-count">
                        <h3 id="user-bets">{data.numBets}</h3>
                        <span>Vedot</span>
                    
                    </div>

                    <div className="user-header-count">
                        <h3 id="user-followers">{data.numFollowers}</h3>
                        <span>Seuraajat</span>
                        
                    </div>

                    <div className="user-header-count">
                        <h3 id="user-following">{data.numFollowing}</h3>
                        <span>Seuraa</span>
                    </div>
                </div>
                
                <div id="buttons">
                    <button className="w-100" onClick={follow} disabled={username === user.username}>Seuraa</button>
                    <button className="w-100" hidden={true} disabled={username === user.username}>Viesti</button>
                </div>
                
                
            </header>

            <div id="user-page-bets">
                <GameList byUser={username}/>
            </div>
        </div>
    )
}

export default User;