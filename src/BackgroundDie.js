import React from 'react';
const DieIcon = './img/die.png';

function BackgroundDie(props){
    return (
        <div id="bg">
            <img id="die-img" src={DieIcon}></img>
        </div>
    );
}

export default BackgroundDie;