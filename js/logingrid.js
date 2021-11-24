class LoginGrid extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div className="grid-item" id="login-grid">
                <label htmlFor="username">Username:</label>
                <input name="username" id="input-username" type="text"></input>
                <button id="button-username-ok" 
                onClick={this.props.connectFunction}>Fetch</button>
            </div>
        )
    }
}