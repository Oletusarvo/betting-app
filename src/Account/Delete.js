import {useContext} from 'react';
import {deleteAccount} from './Api.js';
import AppContext from '../Contexts/AppContext.js';

function Delete(props){
    const {user, token} = useContext(AppContext);

    return(
        <div className="flex-column fill center-all pad-s w-100">
            <div className="container glass flex-column w-100 pad-s bg-fade">
                <h1>Delete Account</h1>
                <form onSubmit={(e) => { e.preventDefault(); deleteAccount(user.username, token)}}>
                    <input name="password1" type="password" placeholder="Enter your password" autoComplete='new-password'></input>
                    <input name="password2" type="password" placeholder='Enter your password again'></input>
                    <button type="submit">Delete Account</button>
                </form>
            </div>
        </div>
    )
}

export default Delete;