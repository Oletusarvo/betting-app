class Home extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            selected : 'login'
        };

        this.login = this.login.bind(this);
        this.signup = this.signup.bind(this);
    }

    login(data){
        //LOGIN
        const state = this.props.state;

        state.action = 'login';
        this.props.updateState(state, () => {
            const req = new XMLHttpRequest();
            req.open('POST', '/login', true);
            req.setRequestHeader('Content-Type', 'application/json');

            req.send(JSON.stringify(data));
            req.onload = () => {
                if(req.status == 200){
                    const payload = JSON.parse(req.response);
                    state.user = payload.user;
                    state.token = payload.token;
                    state.action = 'none';

                    localStorage.setItem('token', state.token);
                    localStorage.setItem('user', JSON.stringify(state.user));
                    
                    this.props.updateState(state);
                }
                else{
                    alert(`Failed to login! Code: ${req.status}`);
                }
            }
        });
    }

    signup(data){
        const state = this.props.state;
        state.action = 'signup';
        this.props.updateState(state, () => {
            const req = new XMLHttpRequest();
            req.open('POST', '/signup', true);
            req.setRequestHeader('Content-Type', 'application/json');

            req.send(JSON.stringify(data));
            req.onload = () => {
                if(req.status === 200){
                    state.action = 'none';
                    this.props.updateState(state);
                }
                else{
                    alert(`Failed to sign up! Code: ${req.status}`);
                }
            }
        });
    }

    render(){
        return (
            <div className="page" id="home-page">
                {
                    this.props.state.user == undefined ? (
                        this.state.selected == 'login' ? 
                        <Login login={this.login}/> :
                        <Signup signup={this.signup}/>
                    ) : 
                    <h1>Logged in as {this.props.state.user.username}</h1>
                }
            </div>
        );
    }

    componentDidMount() {

        //Grab the links from the header component.
        const loginLink = document.querySelector('#login-link');
        loginLink?.addEventListener('click', () => {
            this.state.selected = 'login';
            this.setState(this.state);
        });

        const signupLink = document.querySelector('#signup-link');
        signupLink?.addEventListener('click', () => {
            this.state.selected = 'signup';
            this.setState(this.state);
        });
    }
}