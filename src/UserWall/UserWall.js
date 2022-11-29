import { useContext, useState } from "react";
import AppContext from "../Contexts/AppContext";
import GameList from "../GameList/GameList";

function UserWall(props){

    const {user} = useContext(AppContext);
    const [bets, setBets] = useState([]);

    return (
        <div className="page" id="user-wall-page">
            <header className="margin-bottom page-header">
                <h2 >Seurattujen Vedot</h2>
            </header>
            
            <GameList byFollowedOf={user.username} creatorName={false}/>
        </div>
    )
}

export default UserWall;