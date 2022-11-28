import {useState, useEffect, useContext} from 'react';
import {Link} from 'react-router-dom';
import AppContext from '../Contexts/AppContext';
import './Style.scss';

function Accounts(props){
    const {user, setCurrentAccount} = useContext(AppContext);

    return (
        <>
            <div className="page">
                <h2>Valuuttatilit</h2>
                <ul>
                    {
                        user.accounts.map(acc => {
                            const name = acc.currency.short_name;
                            const balance = acc.balance.toFixed(acc.currency.precision).toLocaleString('en');

                            return (
                                <li onClick={() => setCurrentAccount(acc)}>
                                    <span>{name}</span>
                                    <span>{(acc.currency.symbol || name + ' ') + balance}</span>
                                </li>
                            )
                        })
                    }
                </ul>
            </div>

            <div className="secondary-navbar">
                <div className="secondary-navbar-item">
                    <Link to="">Luo Uusi Valuuttatili</Link>
                </div>
            </div>
        </>
        
    )
}

export default Accounts;