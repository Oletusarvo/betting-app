export function placeBet(socket, bet){
    if(!socket){
        throw new Error('Socket is undefined!');
    }

    if(typeof(bet) !== 'object'){
        throw new Error('Bet must be an object!');
    }

    socket.emit('place_bet', JSON.stringify(bet));
}

export function submit(e, token, username, game_id, setGame){
    e.preventDefault();
    
    const req = new XMLHttpRequest();
    req.open('POST', '/bets', true);
    req.setRequestHeader('auth', token);
    req.setRequestHeader('Content-Type', 'application/json');

    const form = document.querySelector('#betting-form');
    const bet = {
        amount : form.amount.value,
        side : form.side.value,
        username,
        game_id
    };

    req.send(JSON.stringify(bet));

    req.onload = () => {
        if(req.status === 200){
            setGame(
                JSON.parse(req.response)
            );
        }
        else{
            alert(`Bet rejected! Reason: ${req.response}`);
        }
    }
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

export function getBettingState(bet, minimum_bet){
    if(bet == undefined){
        return 'entry';
    }
    else if(bet && Math.round(bet.amount) < Math.round(minimum_bet)){
        return 'call';
    }
    else{
        return 'set';
    }
}