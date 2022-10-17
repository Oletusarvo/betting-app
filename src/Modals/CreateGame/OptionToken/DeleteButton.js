function DeleteButton({deleteOption}){
    return (
        <div className="option-token-delete-btn" onClick={deleteOption}>
            X
        </div>
    );
}