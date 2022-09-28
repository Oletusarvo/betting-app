import { useContext } from "react";
import AppContext from "../Contexts/AppContext";
import GameContext from "../Contexts/GameContext";
import Bet from './Bet.js';
import Balance from '../Balance/Balance.js';

function Info(){

    const {currency} = useContext(AppContext);
    const {game, bet, isExpired} = useContext(GameContext);
    const timeLeft = game.expiry_date != 'When Closed' ? Math.round((new Date(game.expiry_date) - new Date()) / 1000 / 60 / 60 / 24) : NaN;
    const expiryString =  !Number.isNaN(timeLeft) ? timeLeft < 0 ? "Expired" : timeLeft + " days" : "No Limit";

    return (
        <div className={"container glass bg-fade " + (isExpired && "bg-expired")} id="bet-info">
            <table>
                <tbody>
                    <tr>
                        <td>Your Bet:</td>
                        <td className="align-text-right"><Bet/></td>
                    </tr>
                    <tr>
                        <td>Minimum Bet: </td>
                        <td className="align-text-right">{currency + game.minimum_bet.toLocaleString('en')}</td>
                    </tr>

                    <tr>
                        <td>Increment:</td>
                        <td className="align-text-right">{currency + game.increment.toLocaleString('en')}</td>
                    </tr>

                    <tr>
                        <td>Expiry Date:</td>
                        <td className="align-text-right">{game.expiry_date}</td>
                    </tr>

                    <tr>
                        <td>Time Left:</td>
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