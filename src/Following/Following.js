import { useContext, useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom";
import AppContext from "../Contexts/AppContext";

function Following(props){
    const {socket, user} = useContext(AppContext);
    const [followingData, setFollowingData] = useState([]);

    const {username} = useParams();

    useEffect(() => {
        socket.emit('following_get', username, res => {
            if(!res) return;
            setFollowingData(res);
        })
    }, []);

    function unfollow(id){
        socket.emit('unfollow', user.username, id, res => {
           location.reload();
        });
    }

    return (
        <div className="page" id="followers-page">
            <header className="w-100 margin-bottom justify-space-between page-header">
                <h2 className="margin-bottom"><Link to={`/user/${username}`}>{username}</Link> seuraa</h2>
                <input type="search" placeholder="Etsi..."></input>
            </header>
            <ul>
                {
                    followingData.map(item => {
                        return (
                            <li key={item}>
                                <Link to={`/user/${item}`}>{item}</Link>
                                <a onClick={() => unfollow(item)}>Poista</a>
                            </li>
                        )
                    })
                }
            </ul>
        </div>
    )
}

export default Following;