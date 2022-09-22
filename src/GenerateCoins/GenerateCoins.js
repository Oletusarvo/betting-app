import React, {useState, useEffect, useRef, useContext} from 'react';
import AppContext from '../Contexts/AppContext.js';
import './Style.scss';

function GenerateCoins(props){

    const {token, user} = useContext(AppContext);
    
    let cursor = useRef(3);

    function submitGuess(){
        const req = new XMLHttpRequest();
        req.open('POST', '/coins', true);
        req.setRequestHeader('auth', token);

    }

   
}

export default GenerateCoins;