import React, { useState, useContext, useEffect } from 'react';
import {Link} from 'react-router-dom';
import AppContext from '../Contexts/AppContext';
import './Style.scss';
import langStrings from '../lang';

const bellIcon = './img/bell.png';
const logoutIcon = './img/logout.png';
const fiIcon = './img/flag-fi.png';
const enIcon = './img/flag-en.png';


function Header(props){

    const {user, logout} = useContext(AppContext);
    const {notes} = props;
    const [unseenNotes, setUnseenNotes] = useState(0);

    useEffect(() => {
        if(notes){
            const numUnseenNotes = notes ? notes.reduce((acc, cur) => acc += cur.seen == false, 0) : 0;
            setUnseenNotes(numUnseenNotes);
        }
    });

    return (
        <>
            <header>
            <div id="app-name">
                <Link to="/#/">
                    <h3>Veikkaus App</h3>
                </Link>
            </div>

            <div id="links">
                {
                    
                    user == undefined ? 
                    <>
                        <Link id="login-link" className="link" to="/login">Kirjaudu</Link>
                        <Link id="signup-link" className="link" to="/signup">Luo Tili</Link>
                    </>
                    :
                    <>
                        <Link to="/notes" id="notification-button">
                            <i>
                                <img src={bellIcon}></img>
                            </i>
                            <div className={unseenNotes == 0 ? 'hidden' : ''} data-notification-count={unseenNotes} id="notification-count"></div>
                        </Link>
                        <span id="logout-link" onClick={logout}>
                            <img src={logoutIcon}/>
                        </span>
                    </>
                }
            </div>
        </header>
        </>
        
    );
}

export default Header;