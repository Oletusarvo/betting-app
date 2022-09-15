export function deleteAccount(username, token){
    const res = confirm(`Are you sure you want to delete account ${username}?`);
    if(!res) return;

    const req = new XMLHttpRequest();
    req.open('DELETE', `/accounts/${username}`, true);
    req.setRequestHeader('auth', token);
    req.setRequestHeader('Content-Type', 'application/json');

    req.onload = () => {
        if(req.status === 200){
            alert('Account successfully deleted!');
            localStorage.removeItem('betting-app-user');
            localStorage.removeItem('betting-app-token');
            location.assign('/');
        }
        else{
            alert(`Failed to delete account! Reason: ${req.response}`);
        }
    }

    const form = document.querySelector('form');
    const data = {
        username,
        password1 : form.password1.value,
        password2 : form.password2.value,
    };

    req.send(JSON.stringify(data));
}