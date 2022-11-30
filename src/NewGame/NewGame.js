import CreateGameModal from '../Modals/CreateGame/CreateGameModal.js';
import './Style.scss';

const arrowIcon = './img/arrow.png';

function NewGame(){

    function goBack(){
        window.history.back();
    }

    return (
        <div className="page" id="new-game-page">
            <header className="page-header w-100 top">
                <div style={{cursor: "pointer"}} onClick={goBack}>
                    <img src={arrowIcon}></img>
                </div>
            </header>
            <CreateGameModal/>
        </div>
    );
}

export default NewGame;