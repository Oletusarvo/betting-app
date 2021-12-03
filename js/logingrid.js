class LoginGrid extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div className="grid-item" id="login-grid">
                <input 
                    className="login-input"
                    name="username" 
                    id="input-username" 
                    type="text"
                    placeholder="username"/>

                <input 
                    className="login-input"
                    name="password" 
                    id="input-password" 
                    type="password"
                    placeholder="password"/>
                    
                <button id="button-username-ok" 
                onClick={this.props.connectFunction}>Fetch</button>

                <button id="button-create"
                    onClick={this.props.createAccountFunction}>Create</button>
            </div>
        )
    }
}