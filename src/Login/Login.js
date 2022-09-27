import React from 'react';
import LoginModal from '../Modals/Login/LoginModal.js';

import './Style.scss';

function Login(props){
    return(
        <div className="flex-column fill center-all pad w-100" id="login-page">
            <LoginModal/>
        </div>
    );
}

export default Login;