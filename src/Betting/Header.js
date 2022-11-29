import { useContext } from 'react';
import {Link} from 'react-router-dom';
import GameContext from '../Contexts/GameContext';
import './Style.scss';

function Header(){

    const {isExpired, game} = useContext(GameContext);

    function goBack(){
        window.history.back();
    }

    return (
        <div className= {"container glass bg-fade " + (isExpired && " bg-expired")} id="bet-title">
            <div className="back-button" onClick={goBack}>
                <img src="../img/arrow.png"></img>
            </div>
            <h3 id="bet-name">{game.title}</h3>
        </div>
    );
}

export default Header;