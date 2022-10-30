import { useEffect, useContext, useState } from "react";
import AppContext from "../Contexts/AppContext";
import './Style.scss';

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
            <h1>Users</h1>
            <ul>
                {
                    users.map(user => {
                        return(
                            <li>
                                <span>{user.username}</span>
                                <button>Follow</button>
                            </li>
                        )
                    })
                }
            </ul>
        </div>
    );
}

export default Users;