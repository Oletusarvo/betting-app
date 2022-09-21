export function closeGame(game_id, token, setGameList){
    if(typeof(game_id) !== 'string'){
        throw Error('Game id must be a string!');
    }

    const side = document.querySelector(`#side-select-${game_id}`).value;

    const res = confirm(`You are about to close the game on \'${side}\'. Are you sure?`);

    if(!res) return;

    socket.emit
}

export function getDestination(username, game_id){
    return `/games/${game_id}`;
}