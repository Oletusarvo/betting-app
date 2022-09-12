export function signup(data){
    const req = new XMLHttpRequest();
    req.open('POST', '/signup', true);
    req.setRequestHeader('Content-Type', 'application/json');

    req.send(JSON.stringify(data));
    req.onload = () => {
        if(req.status === 200){
            alert('Signup success!');
            location.assign('/#/login');
        }
        else{
            alert(`Failed to sign up! Reason: ${req.response}`);
        }
    }
}
