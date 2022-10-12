import { useEffect, useContext, useState } from "react";
import AppContext from "../Contexts/AppContext";

function Users(props){

    const [users, setUsers] = useState([]);
    const {socket} = useContext(AppContext);
    useEffect(() => {
        socket.emit('users_get', data => {
            if(!data) return;
            setUsers(data);
        });
    });

    return (
        <div className="flex-column fill pad w-100 gap-m overflow-y-scroll overflow-x-hide">
            {
                users.map(user => {
                    return (
                        <UserModal key={user.username} user={user}/>
                    );
                })
            }
        </div>
    );
}

export default Users;