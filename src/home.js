import React from 'react';
import Notifications from './notifications';

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
                    this.props.appState.user === null ? 
                    <h1>Home</h1> :
                    <>  
                        <h1>Logged in as {this.props.appState.user.username}</h1>
                        <Notifications appState={this.props.appState} updateAppState={this.props.updateAppState}/>
                    </>
                    
                }
                
            </div>
        );
    }
}

export default Home;