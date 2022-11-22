import { useContext, useState } from "react";
import AppContext from "../../Contexts/AppContext";
import Loading from '../../Loading/Loading.js';
import langStrings from "../../lang";

function LoginModal(){

    const {setUser, setToken, lang} = useContext(AppContext);
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
                alert(`Sisäänkirjautuminen epäonnistui! Syy: ${req.response}`);
                setLoading(false);
            }
        }
    }

    if(loading){
        return <Loading title={langStrings["login-loading-message"][lang]}/>
    }

    return(
        <div className="modal">
            <header>{langStrings["login-header"][lang]}</header>
            <div className="content glass bg-fade">
                <form id="login-form" onSubmit={submit}>
                    <input name="username" placeholder={`${langStrings["username-placeholder"][lang]}`}></input>
                    <input name="password" placeholder={langStrings["password1-placeholder"][lang]} type="password"></input>
                    <button type="submit">{langStrings["login-button"][lang]}</button>
                </form>
            </div>
            <footer>
                
            </footer>
        </div>
    )
}

export default LoginModal;