import React from 'react';
import {Link} from 'react-router-dom';

class Header extends React.Component{
    constructor(props){
        super(props);

        this.logout = this.logout.bind(this);
    }

    logout(){
        location.assign('/#');

        const state = this.props.state;
        state.action = 'logout';

        this.props.updateState(state, () => {
            state.token = null;
            state.user = null;
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            state.action = 'none';
            this.props.updateState(state);
        });
        
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