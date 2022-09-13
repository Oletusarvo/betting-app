export function submit(e, setUser, setToken){
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
            setUser(user);
            setToken(token);
            location.assign('/#/');
        }
        else{
            alert(`Failed to login! Reason: ${req.response}`);
        }
    }
}