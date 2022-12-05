import DeleteAccountModal from '../Modals/DeleteAccount/DeleteAccountModal.js';
const arrowIcon = './img/arrow.png';

function DeleteAccount(){

    function goBack(){
        window.history.back();
    }
    return(
        <div className="flex-column fill center-all pad w-100 position-relative">
            <header className="page-header w-100 top">
                <div style={{cursor: "pointer"}} onClick={goBack}>
                    <img src={arrowIcon}></img>
                </div>
            </header>
            <DeleteAccountModal/>
        </div>
    )
}

export default DeleteAccount;