import { useContext } from 'react';
import './Style.scss';

function Notifications({notes}){
    return(
        <ul id="notifications-window" className="flex-column center-align w-100"> 
            {
                notes && notes.map(item => {
                    return (
                        <li>
                            <span className="cyan-text">{item.game_title}</span>
                            <span>{item.message}</span>
                        </li>
                    );
                })
            }
        </ul>
    );
}

export default Notifications;