import React from 'react';

class Signup extends React.Component{
    constructor(props){
        super(props);

        this.signup = this.signup.bind(this);
    }

    signup(data){
        const state = this.props.state;
        state.action = 'signup';
        const req = new XMLHttpRequest();
        req.open('POST', '/signup', true);
        req.setRequestHeader('Content-Type', 'application/json');

        req.send(JSON.stringify(data));
        req.onload = () => {
            if(req.status === 200){
                state.action = 'none';
                alert('Signup success!');
                location.assign('/#/login');
            }
            else{
                alert(`Failed to sign up! Reason: ${req.response}`);
            }
        }
    }

    render(){
        return(
            <div className="page" id="signup-page">
                <h1>Signup</h1>
                <form id="signup-form">
                    <input name="username" placeholder="Username"></input>
                    <input name="password1" placeholder="Password" type="password"></input>
                    <input name="password2" placeholder="Enter Password Again" type="password"></input>
                    <button type="submit">Signup</button>
                </form>
            </div>
        );
    }

    componentDidMount(){
        const form = document.querySelector('#signup-form');
        form.addEventListener('submit', e => {
            e.preventDefault();

            const data = {
                username : form.username.value,
                password1 : form.password1.value,
                password2 : form.password2.value
            };

            this.signup(data);
        });
    }
}

export default Signup;