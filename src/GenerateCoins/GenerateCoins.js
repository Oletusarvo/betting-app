import React, {useState, useEffect, useRef, useContext} from 'react';
import AppContext from '../Contexts/AppContext.js';
import './Style.scss';

function GenerateCoins(props){

    const {token, user} = useContext(AppContext);
    const [numbers, setNumbers] = useState([]);
    let cursor = useRef(3);

    function submitGuess(){
        const req = new XMLHttpRequest();
        req.open('POST', '/coins', true);
        req.setRequestHeader('auth', token);

    }

    function input(n){
        let newNumbers = [...numbers];
        newNumbers.push(n);
        setNumbers(newNumbers);
    }

    const numberButtons = [];
    for(let n = 1; n <= 40; ++n){
        numberButtons.push(
            <div className="number-btn" key={`n-btn-${n}`} onClick={() => input(n)}>{n}</div>
        );
    }

    useEffect(() => {

    });

    return (
        <div className="flex-column fill gap-default pad center-all" id="coins-page">
            <div className="flex-column glass container" id="number-display">{numbers.split('').join(' ')}</div>
            <div className="glass" id="number-buttons">{numberButtons}</div>
        </div>
    );
}

export default GenerateCoins;