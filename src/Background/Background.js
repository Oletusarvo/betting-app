import React from 'react';
import './Style.scss';
const DieIcon = './img/bg.png';

function BackgroundDie(props){
    return (
        <div id="bg">
            <img id="die-img" src={DieIcon}></img>
        </div>
    );
}

export default BackgroundDie;