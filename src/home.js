import React from 'react';

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
                    this.props.state.user === null ? 
                    <h1>Home</h1> :
                    <h1>Logged in as {this.props.state.user.username}</h1>
                }
                
            </div>
        );
    }
}

export default Home;