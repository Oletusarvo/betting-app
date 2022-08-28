class Content extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        /*if(this.props.user == undefined){
            return <Login loginFunction={this.props.loginFunction} signupFunction={this.props.signupFunction}/>
        }
        else*/ if(this.props.currentSelection === 'home'){
            return <Home user={this.props.user} loginFunction={this.props.loginFunction} signupFunction={this.props.signupFunction}/>
        }
        else if(this.props.currentSelection === 'account'){
            return <Account user={this.props.user} token={this.props.token} gameCloseFunction={this.props.gameCloseFunction}/>
        }
        else if(this.props.currentSelection === 'games'){
            return <Games user={this.props.user} token={this.props.token} selectGameFunction={this.props.selectGameFunction}/>
        }
        else if(this.props.currentSelection === 'newgame'){
            return <NewGame user={this.props.user} token={this.props.token} newGameFunction={this.props.newGameFunction}/>
        }
        else{
            return <Unknown/>
        }
    }
}