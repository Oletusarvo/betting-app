import React from 'react';
import Spinner from './Spinner';

function Loading (props){
    const {dimensions, title} = props;

    return(
        <div className="flex-column fill w-100 center-all" id="loading-page">
            <Spinner dimensions={dimensions}/>
            <div id="message"><h3>{title}</h3></div>
        </div>
    )
}

export default Loading;