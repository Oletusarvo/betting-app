import React from 'react';
import { Navigate } from 'react-router-dom';

class Login extends React.Component{
    constructor(props){
        super(props);

        this.login = this.login.bind(this);
    }

    login(data){
        const state = this.props.state;

        state.action = 'login';
        this.props.updateState(state, () => {
            const req = new XMLHttpRequest();
            req.open('POST', '/login', true);
            req.setRequestHeader('Content-Type', 'application/json');

            req.send(JSON.stringify(data));
            req.onload = () => {
                state.action = 'none';
                if(req.status == 200){
                    const payload = JSON.parse(req.response);
                    state.user = payload.user;
                    state.token = payload.token;
                    
                    localStorage.setItem('token', state.token);
                    localStorage.setItem('user', JSON.stringify(state.user));
                    
                    this.props.updateState(state, () => location.assign('/#'));
                }
                else{
                    alert(`Failed to login! Code: ${req.status}`);
                    this.props.updateState(state);
                }
            }
        });
    }

    render(){
        return(
            <div className="page" id="login-page">
                <h1>Login</h1>
                <form id="login-form">
                    <input name="username" placeholder="Username"></input>
                    <input name="password" placeholder="Password" type="password"></input>
                    <button type="submit">Login</button>
                </form>
            </div>
        );
    }

    componentDidMount(){
        const form = document.querySelector('#login-form');
        form.addEventListener('submit', e => {
            e.preventDefault();

            const data = {
                username : form.username.value,
                password : form.password.value,
            };

            this.login(data);
        });
    }
}

export default Login;