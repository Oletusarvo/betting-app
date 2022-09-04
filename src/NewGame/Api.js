export function submit(e, user, token, updateState = undefined){
    e.preventDefault();

    const req = new XMLHttpRequest();
    req.open('POST', '/games', true);
    req.setRequestHeader('auth', token);
    req.setRequestHeader('Content-Type', 'application/json');

    const form = document.querySelector('#new-game-form');
    const data = {
        game_title : form.title.value,
        minimum_bet : form.minimumBet.value,
        increment : form.increment.value,
        created_by : user.username,
        available_to : form.availableTo.value,
        expiry_date : form.expiryDate.value,
    }

    req.send(JSON.stringify(data));

    req.onload = () => {
        if(req.status === 200){
            location.assign('/#/games'); //May cause user data to become undefined, as it is not reloaded from local storage i think.
        }
        else{
            alert(req.response);
        }
    }
}