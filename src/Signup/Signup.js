import React, {useEffect} from 'react';
import {signup} from './Api.js';

import './Style.scss';

function Signup(props){

    useEffect(() => {
        const form = document.querySelector('#signup-form');
        form.addEventListener('submit', e => {
            e.preventDefault();

            const data = {
                username : form.username.value,
                password1 : form.password1.value,
                password2 : form.password2.value
            };

            signup(data);
        });
    }, []);

    return(
        <div className="flex-column fill w-100 pad center-all" id="signup-page">
            <div className="container flex-column center-all align-text-center glass w-100 bg-fade">
                <h1>Signup</h1>
                <form id="signup-form">
                    <input name="username" placeholder="Username"></input>
                    <input name="password1" placeholder="Password" type="password"></input>
                    <input name="password2" placeholder="Enter Password Again" type="password"></input>
                    <button type="submit">Signup</button>
                </form>
            </div>
        </div>
    );
}

export default Signup;