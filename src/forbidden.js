import React from 'react';

class Forbidden extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return (
            <div className="page" id="forbidden-page">
                <h1>Access Forbidden</h1>
            </div>
        );
    }
}

export default Forbidden;