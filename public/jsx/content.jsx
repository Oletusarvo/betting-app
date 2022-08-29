class Content extends React.Component{
    constructor(props){
        super(props);
    }

    render(){

       if(this.props.state.appcontext === 'home'){
            return <Home state={this.props.state} updateState={this.props.updateState} action={this.props.action}/>
        }
        else if(this.props.state.appcontext === 'account'){
            return <Account state={this.props.state} updateState={this.props.updateState} action={this.props.action}/>
        }
        else if(this.props.state.appcontext === 'games'){
            return <Games state={this.props.state} updateState={this.props.updateState} action={this.props.action}/>
        }
        else if(this.props.state.appcontext === 'newgame'){
            return <NewGame state={this.props.state} updateState={this.props.updateState} action={this.props.action}/>
        }
        else{
            return <Unknown/>
        }
    }
}