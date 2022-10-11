export function fold(game, bet, token, setGameState){
    const req = new XMLHttpRequest();
    req.open('POST', '/bets/fold', true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.setRequestHeader('auth', token);

    const data = {
        id : game.id,
        username : bet.username,
    }

    req.send(JSON.stringify(data));

    req.onload = () => {
        if(req.status === 200){
            const bet = JSON.parse(req.response);
            const newState = {
                game, bet
            };
            setGameState(newState);
        }
    }
}

export function getBettingState(bet, minimum_bet){
    if(bet == undefined){
        return 'entry';
    }
    else if(bet && !bet.folded && Math.round(bet.amount) < Math.round(minimum_bet)){
        return 'call';
    }
    else{
        return 'set';
    }
}

export function loadData(username, id, token){
    return new Promise((resolve, reject) => {
        const req = new XMLHttpRequest();
        req.open('GET', `/games/data?username=${username}&id=${id}`);
        req.setRequestHeader('auth', token);
        
        req.send();

        req.onload = () => {
            if(req.status === 200){
                resolve(JSON.parse(req.response));
            }
            else{
                reject(req.response);
            }
        }
    });
}