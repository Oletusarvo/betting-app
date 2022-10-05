import {useContext} from 'react';
import GameContext from '../../Contexts/GameContext.js';
import AppContext from '../../Contexts/AppContext.js';
import './Style.scss';

function LotteryInfo(){
    const {game, bet} = useContext(GameContext);
    const {currency} = useContext(AppContext);

    return (
        <div className="container glass bg-fade">
            <table>
                <tbody>
                    <tr>
                        <td>Row Size:</td>
                        <td className="align-text-right">{game.lotto_row_size}</td>
                    </tr>
                    <tr>
                        <td>Row Price:</td>
                        <td className="align-text-right">{currency + game.minimum_bet.toLocaleString('en')}</td>
                    </tr>
                    <tr>
                        <td>Your Row:</td>
                        <td className="align-text-right">{bet ? bet.side : 'No Row'}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

export default LotteryInfo;