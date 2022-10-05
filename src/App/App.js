import React, {useState, useEffect} from 'react';
import {HashRouter as Router, Routes, Route} from 'react-router-dom';
import Home from '../Home/Home';
import Delete from '../Account/Delete.js';
import Header from '../Header/Header.js';
import Navbar from '../Navbar/Navbar.js';
import Games from '../Games/Games.js';
import NewGame from '../NewGame/NewGame.js';
import Login from '../Login/Login.js';
import Signup from '../Signup/Signup.js';
import Unknown from '../unknown';
import Betting  from '../Betting/Betting.js';
import Background from '../Background/Background.js';
import GenerateDice from '../GenerateDice/GenerateDice.js';
import AppContext from '../Contexts/AppContext';
import './Style.scss';
import AccountHeader from '../AccountHeader/AccountHeader';

if('serviceWorker' in navigator){
    navigator.serviceWorker.register('./sw.js').then(() => console.log('Service worker registered!'))
    .catch(err => console.log('Service worker not registered!'));
}

function App (props){
    const [user, setUser] = useState(() => {
        const data = localStorage.getItem('betting-app-user');
        if(!data) return null;

        return JSON.parse(data);
    });

    const [token, setToken] = useState(() => {
        const data = localStorage.getItem('betting-app-token');
        if(!data) return null;

        return data;
    });

    const [socket, setSocket] = useState(() => {
        if(!token){
            console.log('No token found. Setting socket without authentification.');
            return io();
        } 

        console.log('Token found. Setting socket with authentification.');
        return io({
            auth: {
                token
            }
        });
    });

    const [currency] = useState('⚄');
    const [isMining, setIsMining] = useState(false);

    useEffect(() => {
        if(user){
            localStorage.setItem('betting-app-user', JSON.stringify(user));
        }
    }, [user]);

    useEffect(() => {
        if(token){
            localStorage.setItem('betting-app-token', token);
        }
    }, [token]);

    useEffect(() => {
        socket.on('account_update', () => {
            socket.emit('account_get', user.username, update => {
                setUser(update.user);
            });
        })
    }, []);

    return (
        <Router>
            <div id="app" className="flex-column center-align">
                <Background/>
                <AppContext.Provider value={{user, token, socket, currency, setUser, setToken, isMining, setIsMining}}>
                    <Header user={user} setUser={setUser} setToken={setToken}/>
                    {user ? <AccountHeader/> : null}
                    <Routes >
                        <Route path="/" element={
                            <Home user={user} token={token}/>
                        } />

                        <Route exact path="/login" element={<Login setUser={setUser} setToken={setToken}/>} />
                        <Route exact path="/signup" element={<Signup/>} />
                        <Route exact path="/account/delete" element={<Delete/>}></Route>
                        <Route exact path="/games" element={<Games/>} />
                        <Route exact path="/games/:game_id" element={<Betting/>}></Route>
                        <Route exact path="/newgame" element={<NewGame/>} />
                        <Route exact path="/generateDice" element={<GenerateDice/>}></Route>
                        <Route path="*" element={<Unknown/>}/>
                    </Routes>
                    <Navbar user={user}/>
                </AppContext.Provider>
            </div>
        </Router>
    );
}

export default App;