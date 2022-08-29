class Header extends React.Component{
    constructor(props){
        super(props);
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
                            <span id="login-link" className="link">Login</span>
                            <span id="signup-link" className="link">Signup</span>
                        </>
                        :
                        <span id="logout-link" onClick={() => this.props.action('logout')}>Logout</span>
                    }
                    
                </div>
            </header>
        );
    }
}