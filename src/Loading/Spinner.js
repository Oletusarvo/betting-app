import React from 'react';
const Icon = './img/casino-chip.png';
import './Style.scss';

class Spinner extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div className="spinner">
                <img src={Icon} className="ring-prong"></img>
            </div>
        )
    }
}

export default Spinner;