import {useContext} from 'react';
import Balance from '../Balance/Balance.js';
import AppContext from '../Contexts/AppContext';
import './Style.scss';

function AccountHeader(){
    const {user} = useContext(AppContext);
    return (
        <div id="account-header" className="flex-row">
            <span>{user.username}</span>
            <Balance/>
        </div>
    )
}

export default AccountHeader;