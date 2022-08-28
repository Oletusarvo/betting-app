class Navbar extends React.Component{
    constructor(props){
        super(props);

    }

    render(){
        return (
            <div className="navbar">
                <div id="home-link" className={'nav-item' + this.props.currentSelection === 'home' ? ' selected' : ''} onClick={() => this.props.navigateFunction('home')}>
                    <i className="navbar-icon" id="home-icon">
                        <img src="../img/home.png"></img>
                    </i>
                </div>
                {
                    this.props.user !== undefined ? 
                    <>
                         <div id="account-link" className={'nav-item' + this.props.currentSelection === 'account' ? ' selected' : ''} onClick={() => this.props.navigateFunction('account')}>
                            <i className="navbar-icon" id="account-icon">
                                <img src="../img/wallet.png"></img>
                            </i>
                        </div>

                        <div id="games-link" className={'nav-item' + this.props.currentSelection === 'games' ? ' selected' : ''} onClick={() => this.props.navigateFunction('games')}>
                            <i className="navbar-icon" id="games-icon">
                                <img src="../img/casino-chip.png"></img>
                            </i>
                        </div>

                        <div id="new-game-link" className={'nav-item' + this.props.currentSelection === 'new-game' ? ' selected' : ''} onClick={() => this.props.navigateFunction('newgame')}>
                            <i className="navbar-icon" id="new-game-icon">
                                <img src="../img/plus.png"></img>
                            </i>
                        </div>

                    </>
                    :
                    <></>
                    
                }
            </div>

        );
    }
}