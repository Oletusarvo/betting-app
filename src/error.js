import React from 'react';

function Error(props){
    return (
        <div className="page">
            <h1>{props.code}</h1>
            <h3>{props.message}</h3>
        </div>
    );
}

export default Error;