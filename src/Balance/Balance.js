import React, {useState, useEffect, useContext} from 'react';
import AppContext from '../Contexts/AppContext.js';

function Balance(){
    const {user, currency} = useContext(AppContext);
    return (
        <span>{currency + user.balance.toLocaleString('en')}</span>
    );
}

export default Balance;