export function getData(game_id, token){
    const req = new XMLHttpRequest();
    req.open('GET', `/games/${game_id}`, true);
    req.setRequestHeader('auth', token);

    req.send();

    req.onload = () => {
        if(req.status === 200){
            const {game, bet} = JSON.parse(req.response);
            return {
                game : game, 
                bet : bet,
            };
        }
        else{
            return null;
        }
    }
}