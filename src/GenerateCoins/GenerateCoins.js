import React, {useState, useEffect} from 'react';
import {rollDice} from './Api';

function GenerateCoins(props){

    const [rollState, setRollState] = useState('idle');
    const [animateColor, setAnimateColor] = useState('animate-red');
    const {token} = props;

    useEffect(() => {
        console.log('Effect');
        console.log(animateColor);
        const s = document.querySelector('#coins-ring');
        
        setTimeout(() => s.classList.remove(animateColor), 200);

    });

    return (
        <div className="page" id="coins-page">
            <div id="coins-ring" className={animateColor} onClick={() => rollDice(token, setAnimateColor)}>   
                <div className="cube">Guess</div>
                <div className="cube">The</div>
                <div className="cube">Secret</div>
                <div className="cube">Number</div>
            </div>
            
        </div>
    );
}

export default GenerateCoins;