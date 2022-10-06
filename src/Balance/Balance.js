import React, {useState, useEffect, useContext, useRef} from 'react';
import AppContext from '../Contexts/AppContext.js';
import Loading from '../Loading/Loading.js';
import './Style.scss';

function Balance(props){
    const {user, currency, isMining} = useContext(AppContext);
    const [gain, setGain] = useState(0);
    const [showGain, setShowGain] = useState(false);
    const {id} = props;
    const previousBalance = useRef(user.balance);

    useEffect(() => {
        console.log(`User changed`);
        const difference = user.balance - previousBalance.current;
        if(difference == 0) return;

        const balance = document.querySelector(`#${id}`);

        if(difference > 0){
            balance.classList.add('flash-green');
        }
        else if(difference < 0){
            balance.classList.add('flash-red');
        }

        setGain(difference > 0 ? `+${difference}` : difference);
        setShowGain(true);

        setTimeout(() => {
            balance.classList.remove('flash-green');
            balance.classList.remove('flash-red');
            previousBalance.current = user.balance;
        }, 250);

        setTimeout(() => {
            setShowGain(false);

        }, 1500);

    }, [user]);

    return (
        <div className="flex-row gap-s">
            <span className="balance" id={id}>{currency + user.balance.toLocaleString('en')}</span>
            <span className="gain" hidden={showGain == false} style={{color: gain > 0 ? 'limegreen' : 'red'}}>{gain}</span>
            {
                isMining ? <Loading dimensions={{width: "1rem", height: "1rem", borderWidth: "2px"}}/> : null
            }
        </div>
        
    );
}

export default Balance;