class Home extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            selected : 'login'
        };
    }

    render(){
        return (
            <div className="page" id="home-page">
                {
                    this.props.user == undefined ? (
                        this.state.selected == 'login' ? 
                        <Login loginFunction={this.props.loginFunction}/> :
                        <Signup signupFunction={this.props.signupFunction}/>
                    ) : 
                    <h1>Logged in as {this.props.user.username}</h1>
                    
                }
            </div>
        );
    }

    componentDidMount(){
        const loginLink = document.querySelector('#login-link');
        
        if(loginLink){
            loginLink.addEventListener('click', () => {
                this.state.selected = 'login';
                this.setState(this.state);
            });
        }
        
        const signupLink = document.querySelector('#signup-link');
        if(signupLink){
            signupLink.addEventListener('click', () => {
                this.state.selected = 'signup';
                this.setState(this.state);
            });
        }
    }
}