import React from 'react';
import Spinner from './Spinner';

class Loading extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div className="flex-column fill w-100 center-all" id="loading-page">
                <Spinner/>
                <div id="message"><h3>{this.props.title}</h3></div>
            </div>
        )
    }
}

export default Loading;