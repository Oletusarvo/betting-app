import React from 'react';
import {Link} from 'react-router-dom';

import './Style.scss';
const bellIcon = './img/bell.png';

class Header extends React.Component{
    constructor(props){
        super(props);

        this.logout = this.logout.bind(this);
    }

    logout(){
        localStorage.removeItem('betting-app-token');
        localStorage.removeItem('betting-app-user');
        this.props.setUser(null);
        this.props.setToken(null);
        location.assign('/');
    }

    render(){
        return (
            <header>
                <div id="app-name">
                    <Link to="/#/">
                        <h2>Betting App</h2>
                    </Link>
                </div>

                <div id="links">
                    {
                        this.props.user == undefined ? 
                        <>
                            <Link id="login-link" className="link" to="/login">Login</Link>
                            <Link id="signup-link" className="link" to="/signup">Signup</Link>
                        </>
                        :
                        <>
                            <i>
                                <img src={bellIcon}></img>
                            </i>
                            <span id="logout-link" onClick={this.logout}>Logout</span>
                        </>
                        
                    }
                    
                </div>
            </header>
        );
    }
}

export default Header;