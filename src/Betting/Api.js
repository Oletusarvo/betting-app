export function fold(game, bet, token, setGameState){
    const req = new XMLHttpRequest();
    req.open('POST', '/bets/fold', true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.setRequestHeader('auth', token);

    const data = {
        game_id : game.game_id,
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

export function loadData(username, game_id, token){
    return new Promise((resolve, reject) => {
        const req = new XMLHttpRequest();
        req.open('GET', `/games/data?username=${username}&game_id=${game_id}`);
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