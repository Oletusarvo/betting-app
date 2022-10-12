function UserModal(props){

    const {user} = props; //Not the user who is using the app.

    return (
        <div className="modal">
            <header>

            </header>

            <div className="content glass bg-fade">
                <span>{user.username}</span>
            </div>
            <footer></footer>
        </div>
    );
}

export default UserModal;