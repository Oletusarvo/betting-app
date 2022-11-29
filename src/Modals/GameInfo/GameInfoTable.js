import { useContext } from "react";
import AppContext from "../../Contexts/AppContext";

function GameInfoTable({game}){

    const {currency} = useContext(AppContext);
    const pool = game.pool;
    const pool_reserve = game.pool_reserve;
    const minimum_bet = game.minimum_bet;

    return (
        <table>
        <tbody>
            <tr>
                <td>Luonut</td>
                <td className="align-text-right">{game.created_by}</td>
            </tr>
            <tr>
                <td>Tyyppi</td>
                <td className="align-text-right">{game.type}</td>
            </tr>

            <tr>
                <td>Potti</td>
                <td className="align-text-right">{currency.getString(pool + pool_reserve)}</td>
            </tr>

            {
                game.type === 'Lottery' && <tr>
                    <td>Row Size:</td>
                    <td className="align-text-right">{game.lotto_row_size}</td>
                </tr>
            }
            <tr>
                <td>{game.type === "Lottery" ? "Row Price:" : `Vähimmäispanos`}</td>
                <td className="align-text-right">{currency.getString(minimum_bet)}</td>
            </tr>
            
            <tr>
                <td>Eräpäivä</td>
                <td className="align-text-right">{game.expiry_date}</td>
            </tr>
        </tbody>
    </table>      
    )
}

export default GameInfoTable;