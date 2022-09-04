import React from 'react';
import { Navigate } from 'react-router-dom';
import {submit} from './Api';

function Login(props){
    return(
        <div className="page" id="login-page">
            <h1>Login</h1>
            <form id="login-form" onSubmit={(e) => submit(e, props.updateState)}>
                <input name="username" placeholder="Username"></input>
                <input name="password" placeholder="Password" type="password"></input>
                <button type="submit">Login</button>
            </form>
        </div>
    );
}

export default Login;