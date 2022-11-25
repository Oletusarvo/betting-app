import GameList  from '../GameList/GameList.js';
import {Link} from 'react-router-dom';

function HomeLog(props){
    return (
        <>
            <div className="page" id="home-page">
                <div id="home-account-content" className="fill flex-column">
                    <h2>Omat Vedot</h2>
                    <GameList byUser={true}/>  
                </div>
            </div>

            <div className="secondary-navbar">
                <div className="secondary-navbar-item">
                    <Link to="/accounts">Valuuttatilit</Link>
                </div>
                <div className="secondary-navbar-item">
                    <Link to="/account/delete" id="del-link">Poista Tili</Link>
                </div>
            </div>
        </>
        
    )
}

export default HomeLog;