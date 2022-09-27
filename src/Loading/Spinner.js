import React from 'react';
const Icon = './img/casino-chip.png';
import './Style.scss';

function Spinner(props){

    const {dimensions} = props;

    return(
        <div className="spinner" style={dimensions && {width: dimensions.width, height: dimensions.height, borderWidth: dimensions.borderWidth}}></div>
    );
}

export default Spinner;