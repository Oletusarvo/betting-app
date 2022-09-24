import React from 'react';
import AppContext from '../Contexts/AppContext.js';
import {submit} from './Api';
import './Style.scss';

function Login(props){

    const {setUser, setToken} = props;
    return(
        <div className="flex-column fill center-all pad w-100" id="login-page">
            <div className="container flex-column w-100 glass align-text-center center-all">
                <h1>Login</h1>
                <form id="login-form" onSubmit={(e) => submit(e, setUser, setToken)}>
                    <input name="username" placeholder="Username"></input>
                    <input name="password" placeholder="Password" type="password"></input>
                    <button type="submit">Login</button>
                </form>
            </div>
        </div>
    );
}

export default Login;