import React from 'react';
import {HashRouter as Router, Routes, Route} from 'react-router-dom';
import Home from './home';
import Account from './account';
import Header from './header';
import Navbar from './navbar';
import Games from './games';
import NewGame from './newgame';
import Login from './login';
import Signup from './signup';
import Unknown from './unknown';
import Loading from './loading';

class App extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            user : JSON.parse(localStorage.getItem('user')),
            token : localStorage.getItem('token'),
            action : 'none'
        }

        this.updateState = this.updateState.bind(this);
    }

    updateState(state, callback = undefined){
        this.setState(state, callback);
    }

    render(){
        return (
            <Router>
                <div id="app">
                    <Header state={this.state} updateState={this.updateState}/>

                    {
                        this.state.action === 'login' ? 
                        <Loading title="Logging in..."/> :
                        this.state.action === 'logout' ? 
                        <Loading title="Logging out..."/> :
                        this.state.action === 'signup' ? 
                        <Loading title="Signing uo..."/> :
                        this.state.action === 'newgame' ? 
                        <Loading title="Creating bet..."/> :
                        this.state.action === 'deletegame' ?
                        <Loading title="Deleting game..."/> :
                    
                    <Routes >
                        <Route path="/" element={<Home state={this.state} updateState={this.updateState}/>} />
                        <Route exact path="/login" element={<Login state={this.state} updateState={this.updateState}/>} />
                        <Route exact path="/signup" element={<Signup state={this.state} updateState={this.updateState}/>} />
                        <Route exact path="/account" element={<Account state={this.state} updateState={this.updateState}/>} />
                        <Route exact path="/games" element={<Games state={this.state} updateState={this.updateState}/>} />
                        <Route exact path="/newgame" element={<NewGame state={this.state} updateState={this.updateState}/>} />
                        <Route path="*" element={<Unknown/>}/>
                    </Routes>
                    }
                    <Navbar state={this.state}/>
                </div>
            </Router>
        );
    }
}

export default App;