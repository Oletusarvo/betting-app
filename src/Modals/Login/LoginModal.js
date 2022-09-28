import { useContext, useState } from "react";
import AppContext from "../../Contexts/AppContext";
import Loading from '../../Loading/Loading.js';

function LoginModal(props){

    const {setUser, setToken} = useContext(AppContext);
    const [loading, setLoading] = useState(false);

    function submit(e){
        e.preventDefault();

        const req = new XMLHttpRequest();
        req.open('POST', '/login', true);
        req.setRequestHeader('Content-Type', 'application/json');

        const form = document.querySelector('#login-form');
        const data = {
            username : form.username.value,
            password : form.password.value,
        };
    
        req.send(JSON.stringify(data));
        
        setLoading(true);

        req.onload = () => {
            if(req.status === 200){
                const {token, user} = JSON.parse(req.response);
                setUser(user);
                setToken(token);
                location.assign('/');
            }
            else{
                alert(`Failed to login! Reason: ${req.response}`);
                setLoading(false);
            }
        }
    }

    if(loading){
        return <Loading title="Logging in..."/>
    }

    return(
        <div className="modal">
            <header>Login</header>
            <div className="content glass bg-fade">
                <form id="login-form" onSubmit={submit}>
                    <input name="username" placeholder="Username"></input>
                    <input name="password" placeholder="Password" type="password"></input>
                    <button type="submit">Login</button>
                </form>
            </div>
            <footer>
                
            </footer>
        </div>
    )
}

export default LoginModal;