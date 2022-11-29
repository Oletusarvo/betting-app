import React, {useState, useEffect} from 'react';
import {HashRouter as Router, Routes, Route} from 'react-router-dom';
import Home from '../Home/Home';
import DeleteAccount from '../DeleteAccount/DeleteAccount.js';
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
import Notes from '../Notes/Notes.js';
import Users from '../Users/Users.js';
import AppContext from '../Contexts/AppContext';
import './Style.scss';
import AccountHeader from '../AccountHeader/AccountHeader';
import Currency from '../currency';
import NewCurrency from '../NewCurrency/NewCurrency';
import Accounts from '../Accounts/Accounts';

if('serviceWorker' in navigator){
    navigator.serviceWorker.register('./sw.js').then(() => console.log('Service worker registered!'))
    .catch(err => console.log('Service worker not registered!'));
}

const storage = sessionStorage;
const notesKey = 'betting-app-notes';

function App (){
    const [lang, setLang] = useState("en");
    const [user, setUser] = useState(() => {
        const data = storage.getItem('betting-app-user');
        if(!data) return null;

        return JSON.parse(data);
    });

    const [token, setToken] = useState(() => {
        const data = storage.getItem('betting-app-token');
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

    const [notes, setNotes] = useState(() => {
        if(user){
            const notes = localStorage.getItem(`${notesKey}-${user.username}`);
            if(notes){
                return JSON.parse(notes);
            }
        }

        return [];
    });

    const [currentAccount, setCurrentAccount] = useState(null);

    function logout(){
        storage.removeItem('betting-app-token');
        storage.removeItem('betting-app-user');
        setUser(null);
        setToken(null);
        location.assign('/');
    }

    const [currency, setCurrency] = useState(new Currency({}));
    const [isMining, setIsMining] = useState(false);

    useEffect(() => {
        
    });

    useEffect(() => {
        if(user){
            storage.setItem('betting-app-user', JSON.stringify(user));
            socket.emit('notes_get', user.username, data => {
                setNotes(data);
            });

            setCurrentAccount(user.accounts.find(acc => acc.currency.short_name === 'DCE'));
        }
    }, [user]);

    useEffect(() => {
        if(token){
            storage.setItem('betting-app-token', token);
        }
    }, [token]);

    useEffect(() => {
        socket.on('account_update', () => {
            socket.emit('account_get', user.username, update => {
                if(!update) return;
                setUser(update.user);
            });
        });

        socket.on('notes_update', data => {
            if(!data || !user) return;
            const myNotes = data.filter(item => item.username === user.username);
            const currentNotes = [...notes];
            const newNotes = currentNotes.concat(myNotes);
            localStorage.setItem(`${notesKey}-${user.username}`, JSON.stringify(newNotes));
            setNotes(newNotes);
        });

        socket.emit('currency_get', data => {
            setCurrency(new Currency(data));
        });
        
        if(user){
            socket.emit('accounts_get', user.username, data => {
                if(!data) return
                const newUser = user;
                newUser.accounts = data;
                setUser(newUser);
            });
        }

        return () => {
            socket.off('account_update');
            socket.off('note_update');
        }
    }, []);

    function deleteNote(id){
        socket.emit('note_delete', id);
        const index = notes.findIndex(item => item.id === id);
        if(index === -1) return;
        const newNotes = [...notes];
        newNotes.splice(index, 1);
        localStorage.setItem(`${notesKey}-${user.username}`, JSON.stringify(newNotes));
        setNotes(newNotes);
    }

    return (
        <Router>
            <div id="app" className="flex-column center-align">
                <Background/>
                <AppContext.Provider value={{
                    lang,
                    user, 
                    token, 
                    socket, 
                    currency, 
                    notes, 
                    deleteNote, 
                    setNotes, 
                    setUser, 
                    setToken, 
                    isMining, 
                    setIsMining, 
                    logout,
                    currentAccount,
                    setCurrentAccount,
                    }}>
                    <Header user={user} setUser={setUser} setToken={setToken}/>
                    {user ? <AccountHeader/> : null}
                    <Routes >
                        <Route path="/" element={
                            <Home user={user} token={token}/>
                        } />

                        <Route exact path="/login" element={<Login setUser={setUser} setToken={setToken}/>} />
                        <Route exact path="/signup" element={<Signup/>} />
                        <Route exact path="/account/delete" element={<DeleteAccount/>}></Route>
                        <Route exact path="/games" element={<Games/>} />
                        <Route exact path="/games/:id" element={<Betting/>}></Route>
                        <Route exact path="/newgame" element={<NewGame/>} />
                        <Route exact path="/newcurrency" element={<NewCurrency/>}></Route>
                        <Route exact path="/notes" element={<Notes/>}></Route>
                        <Route exact path="/users" element={<Users/>}></Route>
                        <Route exact path="/wallets" element={<Accounts/>}></Route>
                        <Route path="*" element={<Unknown/>}/>
                    </Routes>
                    <Navbar user={user}/>
                </AppContext.Provider>
            </div>
        </Router>
    );
}

export default App;