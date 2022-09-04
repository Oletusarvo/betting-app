import React, {useState} from 'react';

function Notifications(props){

    const [notifications, setNotifications] = useState([]);

    if(notifications.length == 0){
        const req = new XMLHttpRequest();
        req.open('GET', `/notifications/${props.username}`, true);
        req.setRequestHeader('auth', props.token);
        req.send();

        req.onload = () => {
            if(req.status === 200){
                const list = JSON.parse(req.response);
                const final = [];
                list.forEach(item => {
                    const div = <div className="container">
                        <table>
                            <tbody>
                                <tr>
                                    <td>Game:</td>
                                    <td className="align-right">{item.game_title}</td>
                                </tr>

                                <tr>
                                    <td>Message:</td>
                                    <td className="align-right">{item.message}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    final.push(div);
                });

                setNotifications(final);
            }
        }
    }

    return (
        <>
            {notifications}
        </>
    );
}

export default Notifications;