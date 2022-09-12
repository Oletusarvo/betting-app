export function submit(e, updateState){
    e.preventDefault();

    const form = document.querySelector('#login-form');

    const req = new XMLHttpRequest();
    req.open('POST', '/login', true);
    req.setRequestHeader('Content-Type', 'application/json');

    const data = {
        username : form.username.value,
        password : form.password.value,
    };

    req.send(JSON.stringify(data));

    req.onload = () => {
        if(req.status === 200){
            const {token, user} = JSON.parse(req.response);
            updateState({
                token,
                user,
                socket : io(),
            });

            location.assign('/#/');
        }
        else{
            alert(`Failed to login! Reason: ${req.response}`);
        }
    }
}