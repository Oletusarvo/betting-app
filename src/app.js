import React, {useState, useEffect} from 'react';
import {HashRouter as Router, Routes, Route} from 'react-router-dom';
import Home from './Home';
import Account from './Account';
import Header from './Header';
import Navbar from './navbar';
import Games from './Games';
import NewGame from './NewGame/NewGame.js';
import Login from './Login/Login.js';
import Signup from './signup';
import Unknown from './unknown';
import Loading from './loading';
import Betting  from './Betting/Betting.js';
import ManageGame from './ManageGame/ManageGame.js';

function App (props){
    const [state, updateState] = useState({
        user : JSON.parse(localStorage.getItem('user')),
        token : localStorage.getItem('token'),
        action : 'none'
    });

    useEffect(() => {
        if(state && state.user){
            localStorage.setItem('user', JSON.stringify(state.user));
        }

        if(state && state.token){
            localStorage.setItem('token', state.token);
        }
    }, [state]);

    return (
        <Router>
            <div id="app">
                <Header state={state} updateState={updateState}/>
                <Routes >
                    <Route path="/" element={<Home user={state.user} token={state.token}/>} />

                    <Route exact path="/login" element={<Login state={state} updateState={updateState}/>} />
                    <Route exact path="/signup" element={<Signup state={state}/>} />

                    <Route exact path="/account" element={<Account user={state.user} token={state.token}/>} />
                    <Route exact path="/games" element={<Games appState={state}/>} />
                    <Route exact path="/games/:game_id" element={<Betting token={state.token} user={state.user}/>}></Route>
                    <Route exact path="/games/manage/:game_id" element={<ManageGame token={state.token}/>}></Route>

                    <Route exact path="/newgame" element={<NewGame username={state.user} token={state.token}/>} />
                    <Route path="*" element={<Unknown/>}/>
                </Routes>
                <Navbar state={state}/>
            </div>
        </Router>
    );
}

export default App;