import React from 'react';

class LoadingRing extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div className="loading-ring">
                <div className="ring-prong" id="ring-prong1"></div>
            </div>
        )
    }
}

export default LoadingRing;