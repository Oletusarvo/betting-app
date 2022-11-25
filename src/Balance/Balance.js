import React, {useState, useEffect, useContext, useRef} from 'react';
import AppContext from '../Contexts/AppContext.js';
import Loading from '../Loading/Loading.js';
import './Style.scss';
import Currency from '../currency';

function Balance(props){
    const {user, currency, isMining, currencyPrecision, currentAccount} = useContext(AppContext);
    const [gain, setGain] = useState(0);
    const [showGain, setShowGain] = useState(false);
    const {id} = props;
    const previousBalance = useRef(currentAccount ? currentAccount.balance : 0);

    useEffect(() => {
        if(!currentAccount) return;

        const difference = currentAccount.balance - previousBalance.current;
        if(difference == 0) return;

        const balance = document.querySelector(`#${id}`);

        if(difference > 0){
            balance.classList.add('flash-green');
        }
        else if(difference < 0){
            balance.classList.add('flash-red');
        }

        const gain = new Currency(difference, currencyPrecision).get();
        setGain(difference > 0 ? `+${gain}` : gain);
        setShowGain(true);

        setTimeout(() => {
            balance.classList.remove('flash-green');
            balance.classList.remove('flash-red');
            previousBalance.current = currentAccount.balance;
        }, 250);

        setTimeout(() => {
            setShowGain(false);

        }, 1500);

    }, [user]);

    if(!currentAccount) return <span>Loading...</span>;

    const balance = currentAccount.balance.toFixed(currentAccount.currency.precision);
    const cur = currentAccount.currency.symbol || currentAccount.currency.short_name + ' ';

    return (
        <div className="flex-row gap-s">
            <span className="balance" id={id} style={{color: balance < 0 ? 'red' : 'white'}}>{cur + balance}</span>
            <span className="gain" hidden={showGain == false} style={{color: gain > 0 ? 'limegreen' : 'red'}}>{gain}</span>
            {
                isMining ? <Loading dimensions={{width: "1rem", height: "1rem", borderWidth: "2px"}}/> : null
            }
        </div>
        
    );
}

export default Balance;