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

                <div id="login-links">
                    {
                        this.props.user == undefined || (this.props.currentSelection === 'home' && this.props.user == undefined)? 
                        <>
                            <span id="login-link">Login</span>
                            <span id="signup-link">Signup</span>
                        </>
                        :
                        <span id="logout-link" onClick={() => this.props.logoutFunction()}>Logout</span>
                }
                    
                </div>
            </header>
        );
    }
}