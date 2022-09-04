import React, {useState, useEffect} from 'react';

function Balance(props){
    const [balance, setBalance] = useState(0);
    const [lastUpdate, setLastUpdate] = useState(-1);
    const {username, token, latestUpdate} = props;

    useEffect(() => {
        if(lastUpdate >= latestUpdate) return;

        const req = new XMLHttpRequest();
        req.open('GET', `/accounts/${username}`, true);
        req.setRequestHeader('auth', token);
        req.send();

        req.onload = () => {
            if(req.status === 200){
                setBalance(
                    JSON.parse(req.response).balance
                );

                setLastUpdate(latestUpdate);
            }
        }
    });

    return (
        <span>${balance.toFixed(2)}</span>
    );
}

export default Balance;