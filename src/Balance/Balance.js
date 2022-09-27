import React, {useState, useEffect, useContext} from 'react';
import AppContext from '../Contexts/AppContext.js';
import Loading from '../Loading/Loading.js';

function Balance(){
    const {user, currency, isMining} = useContext(AppContext);
    return (
        <div className="flex-row gap-s">
            <span>{currency + user.balance.toLocaleString('en')}</span>
            {
                isMining ? <Loading dimensions={{width: "1rem", height: "1rem", borderWidth: "2px"}}/> : null
            }
        </div>
        
    );
}

export default Balance;