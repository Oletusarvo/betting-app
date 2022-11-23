import Loading from '../../Loading/Loading';
import {useContext, useState} from 'react';

import '../Style.scss';
import langStrings from '../../lang';
import AppContext from '../../Contexts/AppContext';

function SignupModal(){

    const {lang} = useContext(AppContext)
    const [loading, setLoading] = useState(false);

    function submit(e){
        e.preventDefault();
        const req = new XMLHttpRequest();
        req.open('POST', '/signup', true);
        req.setRequestHeader('Content-Type', 'application/json');

        const form = document.querySelector('#signup-form');
        const data = {
            username : form.username.value,
            password1 : form.password1.value,
            password2 : form.password2.value
        };

        req.send(JSON.stringify(data));
        setLoading(true);

        req.onload = () => {
            if(req.status === 200){
                alert('Tilin luominen onnistui!');
                location.assign('/#/login');
            }
            else{
                alert(`Tilin luominen epäonnistui! Syy: ${req.response}`);
                setLoading(false);
            }
        }
    }

    if(loading){
        return <Loading title="Luodaan tiliä..." />
    }

    return(
        <div className="modal">
            <header>Luo Tili</header>
            <div className="content glass bg-fade">
                <form id="signup-form" onSubmit={submit}>
                    <input name="username" placeholder='Käyttäjänimi'></input>
                    <input name="password1" placeholder='Salasana' type="password"></input>
                    <input name="password2" placeholder='Anna salasana uudelleen' type="password"></input>
                    <button type="submit">Luo</button>
                </form>
            </div>
            <footer>
                Antamiasi tietoja käytetään ainoastaan tunnistamiseesi tässä sovelluksessa.
            </footer>
        </div>
    )
}

export default SignupModal;