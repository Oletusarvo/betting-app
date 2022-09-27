import Loading from '../../Loading/Loading';
import {useState} from 'react';

import '../Style.scss';

function SignupModal(props){

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
                alert('Signup success!');
                location.assign('/#/login');
            }
            else{
                alert(`Failed to sign up! Reason: ${req.response}`);
                setLoading(false);
            }
        }
    }

    if(loading){
        return <Loading title="Signing up..." />
    }

    return(
        <div className="modal">
            <header>Signup</header>
            <div className="content glass bg-fade">
                <form id="signup-form" onSubmit={submit}>
                    <input name="username" placeholder="Username"></input>
                    <input name="password1" placeholder="Password" type="password"></input>
                    <input name="password2" placeholder="Enter Password Again" type="password"></input>
                    <button type="submit">Signup</button>
                </form>
            </div>
            <footer>
                
            </footer>
        </div>
    )
}

export default SignupModal;