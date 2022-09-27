import { useContext, useState } from "react";
import AppContext from "../../Contexts/AppContext";
import Loading from "../../Loading/Loading.js";

function DeleteAccountModal(props){

    const {user, token} = useContext(AppContext);
    const [loading, setLoading] = useState(false);

    function deleteAccount(e){
        e.preventDefault();

        const res = confirm(`Are you sure you want to delete account ${user.username}?`);
        if(!res) return;
    
        const req = new XMLHttpRequest();
        req.open('DELETE', `/accounts/${user.username}`, true);
        req.setRequestHeader('auth', token);
        req.setRequestHeader('Content-Type', 'application/json');
        req.send(JSON.stringify(data));

        setLoading(true);

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
    
        
    }

    if(loading){
        return <Loading title="Deleting account..." />
    }

    return (
        <div className="modal">
            <header>Delete Account</header>
            <div className="content">
                <form onSubmit={deleteAccount}>
                    <input name="password1" type="password" placeholder="Enter your password" autoComplete='new-password'></input>
                    <input name="password2" type="password" placeholder='Enter your password again'></input>
                    <button type="submit">Delete Account</button>
                </form>
            </div>
            <footer></footer>
        </div>
    )
}

export default DeleteAccountModal;