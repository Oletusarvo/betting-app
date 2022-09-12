import React from 'react';
import {submit} from './Api';

function Login(props){

    const {updateState} = props;

    return(
        <div className="flex-column fill center-all pad w-100" id="login-page">
            <div className="container flex-column w-100 glass align-text-center center-all bg-fade">
                <h1>Login</h1>
                <form id="login-form" onSubmit={(e) => submit(e, updateState)}>
                    <input name="username" placeholder="Username"></input>
                    <input name="password" placeholder="Password" type="password"></input>
                    <button type="submit">Login</button>
                </form>
            </div>
        </div>
    );
}

export default Login;