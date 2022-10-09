import React, { useState, useContext, useEffect } from 'react';
import {Link} from 'react-router-dom';
import AppContext from '../Contexts/AppContext';
import Notifications from './Notifications.js';

import './Style.scss';
const bellIcon = './img/bell.png';

function Header(props){

    const {user, socket, logout} = useContext(AppContext);
    const [notes, setNotes] = useState([]);

    function toggleNotifications(){
        const notificationsWindow = document.querySelector('#notifications-window');
        if(notificationsWindow.classList.contains('show')){
            notificationsWindow.classList.remove('show');
        }
        else{
            notificationsWindow.classList.add('show');
        }
    }

    useState(() => {
        if(!user) return;

        socket.emit('notes_get', user.username, data => {
            if(!data) return;

            setNotes(data);
        });

        return () => {
            socket.off('account_update');
        }
        
    }, [user]);

    return (
        <>
            
            <header>
            <div id="app-name">
                <Link to="/#/">
                    <h2>Betting App</h2>
                </Link>
            </div>

            <div id="links">
                {
                    user == undefined ? 
                    <>
                        <Link id="login-link" className="link" to="/login">Login</Link>
                        <Link id="signup-link" className="link" to="/signup">Signup</Link>
                    </>
                    :
                    <>
                        <button id="notification-button" onClick={toggleNotifications}>
                            <i>
                                <img src={bellIcon}></img>
                            </i>
                            <div data-notification-count={notes.length} id="notification-count"></div>
                        </button>
                        <span id="logout-link" onClick={logout}>Logout</span>
                    </>
                }
            </div>
        </header>
        </>
        
    );
}

export default Header;