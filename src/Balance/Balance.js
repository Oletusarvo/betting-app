import React, {useState, useEffect, useContext} from 'react';
import AppContext from '../Contexts/AppContext.js';

function Balance(props){
    const [balance, setBalance] = useState('');
    const {user, token} = useContext(AppContext);

    useEffect(() => {
        const req = new XMLHttpRequest();
        req.open('GET', `/accounts/${user.username}`, true);
        req.setRequestHeader('auth', token);
        req.send();

        req.onload = () => {
            if(req.status === 200){
                setBalance(
                    JSON.parse(req.response).balance.toFixed(2)
                );
            }
        }
    }, [props]);

    return (
        <span>${balance}</span>
    );
}

export default Balance;