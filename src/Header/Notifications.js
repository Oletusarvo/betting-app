import './Style.scss';

function Notifications({notifications}){
    let render = [];
    notifications.forEach(item => {
        render.push(
            <div className="notification flex-row center-align w-100">
                <span>
                    <h4>{`${item.game_title}: ${item.message}`}</h4>
                </span>
                <button>Dismiss</button>
            </div>
        );
    });

    return(
        <div id="notifications-window"> 
            {render}
        </div>
    );
}

export default Notifications;