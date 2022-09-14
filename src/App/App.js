import React, {useState, useEffect} from 'react';
import {HashRouter as Router, Routes, Route} from 'react-router-dom';
import Home from '../Home/Home';
import Account from '../Account/Account.js';
import Header from '../Header/Header.js';
import Navbar from '../navbar';
import Games from '../Games/Games.js';
import NewGame from '../NewGame/NewGame.js';
import Login from '../Login/Login.js';
import Signup from '../Signup/Signup.js';
import Unknown from '../unknown';
import Betting  from '../Betting/Betting.js';
import ManageGame from '../ManageGame/ManageGame.js';
import GenerateCoins from '../GenerateCoins/GenerateCoins.js';
import BackgroundDie from '../BackgroundDie.js';
import AppContext from '../Contexts/AppContext';
import './Style.scss';


function App (props){
    const [user, setUser] = useState(() => {
        const data = localStorage.getItem('betting-app-user');
        if(data){
            return JSON.parse(data);
        }

        return null;
    });

    const [token, setToken] = useState(() => {
        const data = localStorage.getItem('betting-app-token');
        if(data) return data;

        return null;
    });


    const [socket] = useState(io());
    const [currency] = useState('⚄');

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

    return (
        <Router>
            <div id="app" className="flex-column center-align">
                <BackgroundDie/>
                <AppContext.Provider value={{user, token, socket, currency}}>
                    <Header user={user} setUser={setUser} setToken={setToken}/>
                    <Routes >
                        <Route path="/" element={
                            <Home user={user} token={token}/>
                        } />

                        <Route exact path="/login" element={<Login setUser={setUser} setToken={setToken}/>} />
                        <Route exact path="/signup" element={<Signup/>} />

                        <Route exact path="/games" element={<Games/>} />
                        <Route exact path="/games/:game_id" element={<Betting/>}></Route>
                        <Route exact path="/coins" element={<GenerateCoins/>}></Route>
                        <Route exact path="/newgame" element={<NewGame/>} />
                        <Route path="*" element={<Unknown/>}/>
                    </Routes>
                    <Navbar user={user}/>
                </AppContext.Provider>
            </div>
        </Router>
    );
}

export default App;