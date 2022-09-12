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
    const [state, updateState] = useState({
        user : JSON.parse(localStorage.getItem('betting-app-user')),
        token : localStorage.getItem('betting-app-token'),
    });

    useEffect(() => {
        if(state && state.user){
            localStorage.setItem('betting-app-user', JSON.stringify(state.user));
        }

        if(state && state.token){
            localStorage.setItem('betting-app-token', state.token);
        }
    }, [state]);

    return (
        <Router>
            <div id="app" className="flex-column center-align">
                <BackgroundDie/>
                <AppContext.Provider value={state}>
                    <Header state={state} updateState={updateState}/>
                    <Routes >
                        <Route path="/" element={
                            <Home user={state.user} token={state.token}/>
                        } />

                        <Route exact path="/login" element={<Login updateState={updateState}/>} />
                        <Route exact path="/signup" element={<Signup/>} />

                        <Route exact path="/games" element={<Games/>} />
                        <Route exact path="/games/:game_id" element={<Betting/>}></Route>
                        <Route exact path="/coins" element={<GenerateCoins/>}></Route>
                        <Route exact path="/newgame" element={<NewGame/>} />
                        <Route path="*" element={<Unknown/>}/>
                    </Routes>
                    <Navbar state={state}/>
                </AppContext.Provider>
            </div>
        </Router>
    );
}

export default App;