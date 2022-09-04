import React, {useState, useEffect} from 'react';

function Balance(props){
    const [balance, setBalance] = useState('');
    const {username, token} = props;

    useEffect(() => {
        console.log('Balance props changed');
        const req = new XMLHttpRequest();
        req.open('GET', `/accounts/${username}`, true);
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