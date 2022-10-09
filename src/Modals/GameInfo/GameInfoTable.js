import { useContext } from "react"
import AppContext from "../../Contexts/AppContext"

function GameInfoTable({game, currency}){
    return (
        <table>
        <tbody>
            <tr>
                <td>Type:</td>
                <td className="align-text-right">{game.type}</td>
            </tr>

            <tr>
                <td>Pool:</td>
                <td className="align-text-right">{currency + (game.pool + game.pool_reserve).toLocaleString('en')}</td>
            </tr>

            {
                game.type === 'Lottery' && <tr>
                    <td>Row Size:</td>
                    <td className="align-text-right">{game.lotto_row_size}</td>
                </tr>
            }
            <tr>
                <td>{game.type === "Lottery" ? "Row Price:" : "Minimum Bet:"}</td>
                <td className="align-text-right">{currency + game.minimum_bet.toLocaleString('en')}</td>
            </tr>
            
            <tr>
                <td>Expires:</td>
                <td className="align-text-right">{game.expiry_date}</td>
            </tr>
        </tbody>
    </table>      
    )
}

export default GameInfoTable;