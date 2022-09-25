import { useContext } from 'react';
import {Link} from 'react-router-dom';
import GameContext from '../Contexts/GameContext';
import './Style.scss';

function Header(){

    const {isExpired, game} = useContext(GameContext);

    return (
        <div className= {"container glass" + (isExpired && " bg-expired")} id="bet-title">
            <Link id="back-button" to="/games">
                <img src="../img/arrow.png"></img>
            </Link>
            <h3 id="bet-name">{game.game_title}</h3>
        </div>
    );
}

export default Header;