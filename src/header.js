import React from 'react';
import {Link} from 'react-router-dom';

class Header extends React.Component{
    constructor(props){
        super(props);

        this.logout = this.logout.bind(this);
    }

    logout(){
        const state = this.props.state;
        state.action = 'logout';
        state.token = null;
        state.user = null;
        state.action = 'none';
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.props.updateState(state);
        location.assign('/');
    }

    render(){
        return (
            <header>
                <div id="app-name">
                    <h2>Betting App</h2>
                </div>

                <div id="links">
                    {
                        this.props.state.user == undefined || (this.props.state.appcontext === 'home' && this.props.state.user == undefined)? 
                        <>
                            <Link id="login-link" className="link" to="/login">Login</Link>
                            <Link id="signup-link" className="link" to="/signup">Signup</Link>
                        </>
                        :
                        <span id="logout-link" onClick={this.logout}>Logout</span>
                    }
                    
                </div>
            </header>
        );
    }
}

export default Header;