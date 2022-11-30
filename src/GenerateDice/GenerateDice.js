import GenerateDiceModal from '../Modals/GenerateDice/GenerateDiceModal.js';
import './Style.scss';

const arrowIcon = './img/arrow.png';

function GenerateDice(){

    function goBack(){
        window.history.back();
    }

    return(
        <div className="flex-column fill center-all pad w-100" id="generate-dice-page">
            <header className="page-header w-100 top">
                <div style={{cursor: "pointer"}} onClick={goBack}>
                    <img src={arrowIcon}></img>
                </div>
            </header>
            <GenerateDiceModal/>
        </div>
    )
}

export default GenerateDice;