import { useContext, useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom";
import AppContext from "../Contexts/AppContext";

function Followers(props){
    const {socket} = useContext(AppContext);
    const [followerData, setFollowerData] = useState([]);

    const {username} = useParams();

    useEffect(() => {
        socket.emit('followers_get', username, res => {
            if(!res) return;
            setFollowerData(res);
        })
    }, []);

    return (
        <div className="page" id="followers-page">
            <header className="w-100 margin-bottom justify-space-between page-header">
                <h2 className="margin-bottom"><Link to={`/user/${username}`}>{username}</Link> seuraajat</h2>
                <input type="search" placeholder="Etsi..."></input>
            </header>
            <ul>
                {
                    followerData.map(item => {
                        return (
                            <li key={item}>
                                <Link to={`/user/${item}`}>{item}</Link>
                            </li>
                        )
                    })
                }
            </ul>
        </div>
    )
}

export default Followers;