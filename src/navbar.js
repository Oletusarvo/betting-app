import React from 'react';
import {Link} from 'react-router-dom';
const HomeIcon = './img/home.png';
const AccountIcon = './img/wallet.png';
const GamesIcon = './img/casino-chip.png';
const PlusIcon = './img/plus.png';
const CoinsIcon = './img/die.png';

class Navbar extends React.Component{
    constructor(props){
        super(props);

    }

    render(){
        return (
            <div className="navbar">
                <div id="home-link">
                    <Link to="/">
                        <i className="navbar-icon" id="home-icon">
                            <img src={HomeIcon}></img>
                        </i>
                    </Link>
                </div>
                {
                    this.props.user !== null ? 
                    <>
                        <div id="games-link">
                            <Link to="/games">
                                <i className="navbar-icon" id="games-icon">
                                    <img src={GamesIcon}></img>
                                </i>
                            </Link>
                            
                        </div>

                        <div id="new-game-link">
                            <Link to="/newgame">
                                <i className="navbar-icon" id="new-game-icon">
                                    <img src={PlusIcon}></img>
                                </i>
                            </Link>
                        </div>
                    </>
                    :
                    <></>
                    
                }
            </div>

        );
    }
}

export default Navbar;