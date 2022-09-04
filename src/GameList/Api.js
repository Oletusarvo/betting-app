export function closeGame(game_id, token, setGameList){
    if(typeof(game_id) !== 'string'){
        throw Error('Game id must be a string!');
    }

    const side = prompt('What side should the game close on?');

    if(!side) return;

    const req = new XMLHttpRequest();
    req.open('DELETE', `/games/${game_id}`, true);

    req.setRequestHeader('auth', token);
    req.setRequestHeader('Content-Type', 'application/json');

    req.send(JSON.stringify({
        side
    }));

    req.onload = () =>{
        if(req.status === 200){
            setGameList(
                JSON.parse(req.response)
            );
        }
        else{
            alert(`Unable to close the game! Reason: ${req.response}`);
        }
    }
}

export function getDestination(username, game_id){
    return `/games/${game_id}`;
}