import React from 'react';

class Notifications extends React.Component{
    constructor(props){
        super(props);

        this.items = [];
        this.loadNotifications.bind(this);

        this.loadNotifications();
    }

    loadNotifications(){
        console.log('Loading notifications...');
        const appState = this.props.appState;
        appState.action = 'notifications';
        this.props.updateAppState(appState, () => {
            const req = new XMLHttpRequest();
            req.open('GET', `/notifications/${appState.user.username}`, true);
            req.setRequestHeader('Content-Type', 'application/json');
            req.setRequestHeader('auth', this.props.appState.token);
            req.send();
            
            req.onload = () => {
                appState.action = 'none';
                if(req.status === 200){
                    this.items = JSON.parse(req.response);
                    console.log(this.items);
                }
                else{
                    alert('Failed to load notifications!');
                }

                this.props.updateAppState(appState);
            }
        });
       
    }

    render(){
        const final = [];
        this.items.forEach(item => {
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

        return (
            <div className="page">
                <h1>Notifications</h1>
                {final}
            </div>
        
        );
        
    }
}

export default Notifications;