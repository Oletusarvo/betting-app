import React from 'react';
import {Link} from 'react-router-dom';
import './Style.scss';

const HomeIcon = './img/home.png';
const GamesIcon = './img/search.png';
const PlusIcon = './img/plus.png';
const CoinsIcon = './img/die.png';
const UsersIcon = './img/user.png';

class Navbar extends React.Component{
    constructor(props){
        super(props);

    }

    render(){
        return (
            <div className="navbar">
                {
                    this.props.user !== null ? 
                    <>
                         <div id="home-link">
                            <Link to="/">
                                <i className="navbar-icon" id="home-icon">
                                    <img src={HomeIcon}></img>
                                </i>
                            </Link>
                        </div>

                        <div id="user-link">
                            <Link to={`user/${this.props.user.username}`}>
                                <i className="navbar-icon">
                                    <img src={UsersIcon}></img>
                                </i>
                            </Link>
                        </div>

                        <div id="games-link">
                            <Link to="/games">
                                <i className="navbar-icon" id="games-icon">
                                    <img src={GamesIcon}></img>
                                </i>
                            </Link>
                            
                        </div>
                    </>
                    :
                    <>
                        <div id="home-link">
                        <Link to="/">
                            <i className="navbar-icon" id="home-icon">
                                <img src={HomeIcon}></img>
                            </i>
                        </Link>
                        </div>
                    </>
                    
                }
            </div>

        );
    }
}

export default Navbar;