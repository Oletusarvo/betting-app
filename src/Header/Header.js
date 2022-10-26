import React, { useState, useContext, useEffect } from 'react';
import {Link} from 'react-router-dom';
import AppContext from '../Contexts/AppContext';
import './Style.scss';
const bellIcon = './img/bell.png';

function Header(){

    const {user, socket, logout, notes} = useContext(AppContext);

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
                        <Link to="/notes" id="notification-button">
                            <i>
                                <img src={bellIcon}></img>
                            </i>
                            <div data-notification-count={notes ? notes.reduce((acc, cur) => acc += cur.seen == false, 0) : 0} id="notification-count"></div>
                        </Link>
                        <span id="logout-link" onClick={logout}>Logout</span>
                    </>
                }
            </div>
        </header>
        </>
        
    );
}

export default Header;