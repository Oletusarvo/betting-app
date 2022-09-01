import React from 'react';
import Loading from './loading';

class GameList extends React.Component{
    constructor(props){
        super(props);
        this.closeGame = this.closeGame.bind(this);
    }

    closeGame(id){
        const state = this.props.appState;
        const side = prompt('What side should the bet close on? (Y/N)');

        if(side == undefined){
            return;
        }

        state.action = 'deletegame';
        this.props.updateAppState(state, () => {
            const req = new XMLHttpRequest();
            req.open('DELETE', '/games', true);
            req.setRequestHeader('Content-Type', 'application/json');
            req.setRequestHeader('auth', state.token);
            
            const data = {
                id,
                side
            };
    
            req.send(JSON.stringify(data));
    
            req.onload = () => {
                state.action = 'none';
                if(req.status !== 200){
                    alert(`Failed to close the bet! Reason: ${req.response}`);
                }

                this.props.updateAppState(state);
            }
        });
    }

    render(){
        const final = [];
        this.props.gamelist.forEach(item => {
            const elem = <div className="game-list-entry container" key={item.game_id} onClick={ () => this.props.selectGame ? this.props.selectGame(item) : {}}>
                <table>
                    <tbody>
                        <tr>
                            <td>Title:</td>
                            <td className="align-right">{item.game_title}</td>
                        </tr>

                        <tr>
                            <td>Minumum Bet:</td>
                            <td className="align-right">${item.minimum_bet}</td>
                        </tr>

                        <tr>
                            <td>Increment:</td>
                            <td className="align-right">${item.increment}</td>
                        </tr>

                        <tr>
                            <td>Pool:</td>
                            <td className="align-right">${item.pool}</td>
                        </tr>

                        <tr>
                            <td>Created By:</td>
                            <td className="align-right">{item.created_by}</td>
                        </tr>

                        <tr>
                            <td>Expires In:</td>
                            <td className="align-right">{item.expiry_date}</td>
                        </tr>
                    </tbody>
                </table>
                {
                    this.props.deleteEnabled && 
                    (
                        item.expiry_date == 'When Closed' || 
                        new Date().getMilliseconds() >= new Date(item.expiry_date).getMilliseconds()
                    ) 
                    
                    ? 
                    <button onClick={() => this.closeGame(item.game_id)}>Close</button> : <></>
                }
            </div>

            final.push(elem);
        });

        if(this.props.loading){
            return <Loading title="Loading bet list..."/>
        }
        else{
            return (
                <div className="page" id="games-page">
                    <h1>{this.props.title}</h1>
                    {final.length > 0 ? final : <h1>No games were loaded. Please try again later.</h1>}
                </div>
            );
        }
    }
}

export default GameList;