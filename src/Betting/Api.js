export function placeBet(socket, bet){
    if(!socket){
        throw new Error('Socket is undefined!');
    }

    if(typeof(bet) !== 'object'){
        throw new Error('Bet must be an object!');
    }

    socket.emit('place_bet', JSON.stringify(bet));
}

export function fold(game_id, username, token, setBet){
    const req = new XMLHttpRequest();
    req.open('POST', '/bets/fold', true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.setRequestHeader('auth', token);

    const data = {
        game_id,
        username,
    }

    req.send(JSON.stringify(data));

    req.onload = () => {
        if(req.status === 200){
            const bet = JSON.parse(req.response);
            setBet(bet);
        }
    }
}

export function submit(e, token, username, game_id, setGame){
    e.preventDefault();

    const req = new XMLHttpRequest();
    req.open('POST', '/bets', true);
    req.setRequestHeader('auth', token);
    req.setRequestHeader('Content-Type', 'application/json');

    const form = document.querySelector('#betting-form');
    const bet = {
        amount : form.amount.valueAsNumber,
        side : form.side.value,
        username,
        game_id
    };

    req.send(JSON.stringify(bet));

    req.onload = () => {
        if(req.status !== 200){
            alert(`Bet rejected! Reason: ${req.response}`);
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

export function call(username, game_id, amount, token){
    const callAmount = amount;
    const res = confirm(`You are about to call for ${callAmount}. Are you sure?`);
    if(res){
        const req = new XMLHttpRequest();
        req.open('POST', '/bets', true);
        req.setRequestHeader('auth', token);
        req.setRequestHeader('Content-Type', 'application/json');

        const bet = {
            username,
            game_id,
            amount
        }
        
        req.send(JSON.stringify(bet));

        req.onload = () => {
            if(req.status !== 200){
                alert(`Call failed! Reason: ${req.response}`);
            }
        }
    }
}

export function loadBet(username, game_id, token){
    return new Promise((resolve, reject) => {
        const req = new XMLHttpRequest();
        req.open('GET', `/bets/?username=${username}&game_id=${game_id}`, true);
        req.setRequestHeader('auth', token);

        req.onload = () => {
            if(req.status === 200){
                if(req.response == ""){
                    resolve(null);
                } 
                else{
                    const res = JSON.parse(req.response);
                    resolve(res);
                }
            }
            else{
                reject({
                    statusCode : req.status,
                    reason: req.response
                });
            }
        }

        req.send();
    });
}

export function loadGame(game_id, token){
    return new Promise((resolve, reject) => {
        const req = new XMLHttpRequest();
        req.open('GET', `/games/${game_id}`);
        req.setRequestHeader('auth', token);
        req.onload = () => {
            if(req.status === 200){
                const data = JSON.parse(req.response);
                if(!data){
                    reject(`Unable to load game data!`);
                }
                else{
                    resolve(data);
                }
            }
            else{
                reject({
                    statusCode : req.status,
                    reason: req.response
                });
            }
        }

        req.send();
    })
}