import AppContext from "../Contexts/AppContext"
import {useContext, useEffect, useState} from 'react';
import GameList from "../GameList/GameList";
import './Style.scss';

function User(props){

    const {user, socket} = useContext(AppContext);
    const [data, setData] = useState({
        numBets: 0,
        numFollowers: 0,
        numFollowing: 0,
    });

    useEffect(() => {
        socket.emit('get_user_data', user.username, dataUpdate => {
            if(!dataUpdate) return;
            setData(dataUpdate);
        })
    }, []);

    return (
        <div className="page" id="user-page">
            <header id="user-page-header" className="margin-bottom">
                <h2 id="user-icon">{user.username}</h2>
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
            </header>

            <div id="user-page-bets">
                <GameList byUser={true}/>
            </div>
        </div>
    )
}

export default User;