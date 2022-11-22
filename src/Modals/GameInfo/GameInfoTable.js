import { useContext } from "react";
import AppContext from "../../Contexts/AppContext";
import langStrings from "../../lang";

function GameInfoTable({game}){

    const {currencyPrecision, currency, lang} = useContext(AppContext);
    const pool = game.pool / currencyPrecision;
    const pool_reserve = game.pool_reserve / currencyPrecision;
    const minimum_bet = game.minimum_bet / currencyPrecision;

    return (
        <table>
        <tbody>
            <tr>
                <td>{langStrings["game-info-type"][lang]}</td>
                <td className="align-text-right">{game.type}</td>
            </tr>

            <tr>
                <td>{langStrings["game-info-pool"][lang]}</td>
                <td className="align-text-right">{currency + (pool + pool_reserve).toFixed(2).toLocaleString('en')}</td>
            </tr>

            {
                game.type === 'Lottery' && <tr>
                    <td>Row Size:</td>
                    <td className="align-text-right">{game.lotto_row_size}</td>
                </tr>
            }
            <tr>
                <td>{game.type === "Lottery" ? "Row Price:" : `${langStrings["game-info-minbet"][lang]}`}</td>
                <td className="align-text-right">{currency + minimum_bet.toFixed(2).toLocaleString('en')}</td>
            </tr>
            
            <tr>
                <td>{langStrings["game-info-expirydate"][lang]}</td>
                <td className="align-text-right">{game.expiry_date}</td>
            </tr>
        </tbody>
    </table>      
    )
}

export default GameInfoTable;