class App extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            currentSelection : 'home',
            user : localStorage.getItem('user') || undefined,
            token : localStorage.getItem('token') || '',
            action : 'none'
        }

        this.signupFunction = this.signupFunction.bind(this);
        this.loginFunction = this.loginFunction.bind(this);
        this.bettingBackButtonFunction = this.bettingBackButtonFunction.bind(this);
        this.gameCloseFunction = this.gameCloseFunction.bind(this);
        this.newGameFunction = this.newGameFunction.bind(this);
        this.logoutFunction = this.logoutFunction.bind(this);
        this.navigate = this.navigate.bind(this);

    }

    signupFunction(data){
        this.state.action = 'signup';
        this.setState(this.state, () => {
            const req = new XMLHttpRequest();
            req.open('POST', '/signup', true);
            req.setRequestHeader('Content-Type', 'application/json');

            

            req.send(JSON.stringify(data));
            req.onload = () => {
                if(req.status === 200){
                    this.state.action = 'none';
                    this.setState(this.state);
                }
            }
        });
    }

    loginFunction(data){
        //LOGIN
        this.state.action = 'login';
        this.setState(this.state, () => {
            const req = new XMLHttpRequest();
            req.open('POST', '/login', true);
            req.setRequestHeader('Content-Type', 'application/json');

            req.send(JSON.stringify(data));
            req.onload = () => {
                if(req.status == 200){
                    const payload = JSON.parse(req.response);
                    this.state.user = payload.user;
                    this.state.token = payload.token;
                    this.state.action = 'none';

                    localStorage.setItem('token', this.state.token);
                    localStorage.setItem('user', this.state.user);
                    
                    this.setState(this.state);
                }
            }
        });
    }

    logoutFunction(){
        this.state.action = 'logout';
        this.setState(this.state, () => {
            this.state.currentSelection = 'home';
            this.state.user = undefined;
            this.state.token = '';
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            this.state.action = 'none';
            this.setState(this.state);
        });
    }

    bettingBackButtonFunction(){
        this.state.selectedGame
    }

    gameCloseFunction(id){
        this.state.action = 'delete';
        this.setState(this.state, () => {
            const req = new XMLHttpRequest();
            req.open('DELETE', '/gamelist', true);
            req.setRequestHeader('Content-Type', 'application/json');
            req.setRequestHeader('auth', this.state.token);
            
            const data = {
                id
            };
    
            req.send(JSON.stringify(data));
    
            req.onload = () => {
                if(req.status == 200){
                    this.state.action = 'none';
                    this.setState(this.state);
                }
            }
        });
    }

    newGameFunction(game){
        this.state.action = 'newgame';
        this.setState(this.state, () => {
            const req = new XMLHttpRequest();
            req.open('POST', '/gamelist', true);
            req.setRequestHeader('Content-Type', 'application/json');
            req.setRequestHeader('auth', this.state.token);

            req.send(JSON.stringify(game));

            req.onload = () => {
                if(req.status == 200){
                    this.state.currentSelection = 'games';
                    this.state.action = 'none';
                    this.setState(this.state);
                }
            }
        });
    }

    navigate(target){
        this.state.currentSelection = target;
        this.setState(this.state);
    }

    render(){
        return (
            <div id="app">
                <Header user={this.state.user} logoutFunction={this.logoutFunction} currentSelection={this.state.currentSelection}/>
                {
                    this.state.action === 'login' ? 
                    <Loading title="Logging In..."/> :
                    this.state.action === 'logout' ?
                    <Loading title="Logging Out..."/> :
                    this.state.action === 'newgame' ? 
                    <Loading title="Creating Bet..."/> :
                    this.state.action === 'signup' ?
                    <Loading title="Signing up..."/> :
                    this.state.action === 'delete' ? 
                    <Loading title="Deleting bet..."/> :
                    
                    <Content 
                        currentSelection={this.state.currentSelection} 
                        user={this.state.user} 
                        token={this.state.token}
                        loginFunction={this.loginFunction}
                        signupFunction={this.signupFunction}
                        bettingBackButtonFunction={this.bettingBackButtonFunction}
                        gameCloseFunction={this.gameCloseFunction}
                        newGameFunction={this.newGameFunction}
                    />

                }
                
                <Navbar user={this.state.user} navigateFunction={this.navigate}/>
            </div>
        );
    }

    componentDidMount(){
        const logoutLink = document.querySelector('#logout-link');
        if(logoutLink){
            logoutLink.addEventListener('click', () => {
                this.state.selected = 'login';
                
            });
        }
    }
}

ReactDOM.render(
    <App/>,
    document.getElementById('root')
);