import React, {useEffect} from 'react';
import SignupModal from '../Modals/Signup/Signup.js';

import './Style.scss';

function Signup(props){
    return(
        <div className="flex-column fill w-100 pad center-all" id="signup-page">
            <SignupModal/>
        </div>
    );
}

export default Signup;