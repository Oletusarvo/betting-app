import AppContext from "../Contexts/AppContext";
import {useContext, useEffect, useState} from React;
import './Style.scss';

function GameHistory(props){
    const {socket} = useContext(AppContext);
    const [history, setHistory] = useState([]);

    useEffect(() => {
        socket.emit('gamehistory_get', data => {
            if(!data) return;
            setHistory(data);
        });
    }, []);

    return (
        <div className="flex-column fill pad w-100 gap-m overflow-y-scroll overflow-x-hide">
            <ul>
                {
                    history.map(item => {
                        return (
                            <li>
                                <span>{item.game_title}</span>
                                <span>{item.result}</span>
                                <span>{item.created_at}</span>
                            </li>
                        )
                    })
                }
            </ul>
        </div>
    )
}

export default GameHistory;