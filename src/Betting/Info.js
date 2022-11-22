import { useContext } from "react";
import AppContext from "../Contexts/AppContext";
import GameContext from "../Contexts/GameContext";
import Bet from './Bet.js';
import Currency from '../currency';
import langStrings from "../lang";

function Info(){

    const {currency, currencyPrecision, lang} = useContext(AppContext);
    const {game, bet, isExpired} = useContext(GameContext);
    const timeLeft = game.expiry_date != 'When Closed' ? Math.round((new Date(game.expiry_date) - new Date()) / 1000 / 60 / 60 / 24) : NaN;
    const expiryString =  !Number.isNaN(timeLeft) ? timeLeft < 0 ? "Erääntynyt" : timeLeft + " päivää" : "Ei Rajaa";

    const minimum_bet = new Currency(game.minimum_bet, currencyPrecision).getAsString('en');
    const increment = new Currency(game.increment, currencyPrecision).getAsString('en');

    return (
        <div className={"container glass bg-fade " + (isExpired && "bg-expired")} id="bet-info">
            <table>
                <tbody>
                    <tr>
                        <td>{langStrings["game-info-bet"][lang]}</td>
                        <td className="align-text-right"><Bet/></td>
                    </tr>
                    <tr>
                        <td>{langStrings["game-info-minbet"][lang]}</td>
                        <td className="align-text-right">{currency + minimum_bet}</td>
                    </tr>

                    <tr>
                        <td>{langStrings["game-info-increment"][lang]}</td>
                        <td className="align-text-right">{currency + increment}</td>
                    </tr>

                    <tr>
                        <td>{langStrings["game-info-expirydate"][lang]}</td>
                        <td className="align-text-right">{game.expiry_date}</td>
                    </tr>

                    <tr>
                        <td>{langStrings["game-info-timeleft"][lang]}</td>
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