import { useContext, useState } from "react";
import AppContext from "../../Contexts/AppContext";
import Loading from "../../Loading/Loading.js";

function DeleteAccountModal(){

    const {user, token, logout} = useContext(AppContext);
    const [loading, setLoading] = useState(false);

    function deleteAccount(e){
        e.preventDefault();

        const res = confirm(`Olet poistamassa tiliä ${user.username}. Oletko varma?`);
        if(!res) return;
    
        const req = new XMLHttpRequest();
        req.open('DELETE', `/accounts/${user.username}`, true);
        req.setRequestHeader('auth', token);
        req.setRequestHeader('Content-Type', 'application/json');
        req.send(JSON.stringify(data));

        setLoading(true);

        req.onload = () => {
            if(req.status === 200){
                alert('Tilin poisto onnistui!');
                logout();
            }
            else{
                alert(`Tilin poisto epäonnistui! Syy: ${req.response}`);
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
        return <Loading title="Poistetaan tiliä..." />
    }

    return (
        <div className="modal">
            <header>Poista Tili</header>
            <div className="content">
                <form onSubmit={deleteAccount}>
                    <input name="password1" type="password" placeholder="Anna salasanasi" autoComplete='new-password'></input>
                    <input name="password2" type="password" placeholder='Anna salasanasi uudelleen'></input>
                    <button type="submit">Poista Tili</button>
                </form>
            </div>
            <footer>
                <strong>Huomio!</strong><br/>
                Poistettua tiliä ei voida palauttaa!
            </footer>
        </div>
    )
}

export default DeleteAccountModal;