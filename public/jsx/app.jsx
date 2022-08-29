import {BrowserRouter as Router} from 'react-router';

class App extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            appcontext : 'home',
            user : undefined,
            token : localStorage.getItem('token'),
            action : 'none'
        };

        const user = localStorage.getItem('user');
        this.state.user = user ? JSON.parse(user) : undefined;

        this.bettingBackButtonFunction = this.bettingBackButtonFunction.bind(this);
        this.gameCloseFunction = this.gameCloseFunction.bind(this);
        this.logout = this.logout.bind(this);
        this.navigate = this.navigate.bind(this);
        this.action = this.action.bind(this);
        this.updateState = this.updateState.bind(this);

    }

    logout(){
        this.state.action = 'logout';
        this.setState(this.state, () => {
            this.state.appcontext = 'home';
            this.state.user = undefined;
            this.state.token = undefined;
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
                else{
                    alert(`Failed to close the bet! Code: ${req.status}`);
                }
            }
        });
    }

    navigate(target){
        this.state.appcontext = target;
        this.setState(this.state);
    }

    fold(){
        this.state.action = 'fold';
        this.setState(this.state, () => {
            const req = new XMLHttpRequest();
            req.open('POST', 'gamelist/fold', true);
            req.setRequestHeader('auth', this.state.token);
        });
    }

    action(id, options = undefined){
        if(id === 'logout'){
            this.logout();
        }
        else if(id === 'closegame'){
            this.gameCloseFunction(options);
        }
        else if(id === 'fold'){
            this.fold();
        }
    }

    updateState(newState, callback = undefined){
        this.setState(newState, callback);
    }

    render(){
        return (
            <div id="app">
                <Header state={this.state} action={this.action}/>
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
                    this.state.action === 'betting' ? 
                    <Loading title="Placing bet..."/> :
                    
                    <Content 
                        action={this.action}
                        updateState={this.updateState}
                        state={this.state}
                    />
                }
                
                <Navbar user={this.state.user} navigateFunction={this.navigate}/>
            </div>
        );
    }
}

ReactDOM.render(
    <App/>,
    document.getElementById('root')
);