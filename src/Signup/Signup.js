import SignupModal from '../Modals/Signup/SignupModal.js';

import './Style.scss';

function Signup(){
    return(
        <div className="flex-column fill w-100 pad center-all" id="signup-page">
            <SignupModal/>
        </div>
    );
}

export default Signup;