import './Style.scss';

function DeleteButton({deleteOption}){
    return (
        <div className="option-token-delete-btn flex-column center-all pad" onClick={deleteOption}>
            <span>x</span>
        </div>
    );
}

export default DeleteButton;