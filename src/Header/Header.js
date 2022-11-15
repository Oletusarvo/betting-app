import React, { useState, useContext, useEffect } from 'react';
import {Link} from 'react-router-dom';
import AppContext from '../Contexts/AppContext';
import './Style.scss';
const bellIcon = './img/bell.png';

function Header(){

    const {user, logout, notes} = useContext(AppContext);

    const numUnseenNotes = notes ? notes.reduce((acc, cur) => acc += cur.seen == false, 0) : 0;
    return (
        <>
            <header>
            <div id="app-name">
                <Link to="/#/">
                    <h2>Veikkaus App</h2>
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
                            <div className={numUnseenNotes == 0 ? 'hidden' : ''} data-notification-count={numUnseenNotes} id="notification-count"></div>
                        </Link>
                        <span id="logout-link" onClick={logout}>Kirjaudu Ulos</span>
                    </>
                }
            </div>
        </header>
        </>
        
    );
}

export default Header;