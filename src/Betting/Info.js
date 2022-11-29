import { useContext } from "react";
import AppContext from "../Contexts/AppContext";
import GameContext from "../Contexts/GameContext";
import Bet from './Bet.js';
import Link from 'react-router-dom';

function Info(){

    const {currency} = useContext(AppContext);
    const {game, bet, isExpired} = useContext(GameContext);
    const timeLeft = game.expiry_date != 'When Closed' ? Math.round((new Date(game.expiry_date) - new Date()) / 1000 / 60 / 60 / 24) : NaN;
    const expiryString =  !Number.isNaN(timeLeft) ? timeLeft < 0 ? "Erääntynyt" : timeLeft + " päivää" : "Ei Rajaa";

    const minimum_bet = game.minimum_bet;
    const increment = game.increment;

    return (
        <div className={"container glass bg-fade " + (isExpired && "bg-expired")} id="bet-info">
            <table>
                <tbody>
                    <tr>
                        <td>Veto</td>
                        <td className="align-text-right"><Bet/></td>
                    </tr>

                    <tr>
                        <td>Luonut</td>
                        <td className="align-text-right"><a href={`#/user/${game.created_by}`}>{game.created_by}</a></td>
                    </tr>
                    <tr>
                        <td>Vähimmäispanos</td>
                        <td className="align-text-right">{currency.getString(minimum_bet)}</td>
                    </tr>

                    <tr>
                        <td>Korotus</td>
                        <td className="align-text-right">{currency.getString(increment)}</td>
                    </tr>

                    <tr>
                        <td>Eräpäivä</td>
                        <td className="align-text-right">{game.expiry_date == 'When Closed' ? 'Suljettaessa' : game.expiry_date}</td>
                    </tr>

                    <tr>
                        <td>Aikaa jäljellä</td>
                        <td className="align-text-right">
                            {expiryString}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>       
    )
}

export default Info;