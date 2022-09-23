import React, { useState, useContext, useEffect } from 'react';
import {Link} from 'react-router-dom';
import AppContext from '../Contexts/AppContext';
import Notifications from './Notifications.js';

import './Style.scss';
const bellIcon = './img/bell.png';

function Header(){

    const {user, setUser, setToken, socket} = useContext(AppContext);
    const [notifications, setNotifications] = useState([]);
    const [seenNoti, setSeenNoti] = useState(false);

    function logout(){
        localStorage.removeItem('betting-app-token');
        localStorage.removeItem('betting-app-user');
        setUser(null);
        setToken(null);
        location.assign('/');
    }

    function toggleNotifications(){
        const notificationsWindow = document.querySelector('#notifications-window');
        if(notificationsWindow.classList.contains('show')){
            notificationsWindow.classList.remove('show');
            setSeenNoti(true);
        }
        else{
            notificationsWindow.classList.add('show');
        }
    }

    useEffect(() => {
        if(!user) return;

        socket.emit('noti_get', user.username, noti => {
            setNotifications(noti);
        });

        socket.on('noti_update', noti => {
            setNotifications(noti.filter(item => item.username === user.username));
        });

        return () => {
            socket.off('noti_update');
        }
    }, [user]);

    return (
        <>
            <Notifications notifications={notifications}/>
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
                            <div hidden={seenNoti} data-notification-count={notifications.length} id="notification-count"></div>
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