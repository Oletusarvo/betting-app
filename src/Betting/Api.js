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

