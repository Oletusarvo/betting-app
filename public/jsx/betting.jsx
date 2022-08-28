class Betting extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return (
            <div className="page" id="betting-page">
                <div className="betting-container container" id="bet-title">
                    <div id="back-button" onClick={this.props.bettingReturnFunction}>
                        <img src="../img/arrow.png"></img>
                    </div>
                    <h3 id="bet-name">{this.props.selectedGame.game_title}</h3>
                </div>

                <div className="betting-container container" id="bet-info">
                    <table>
                        <tbody>
                            <tr>
                                <td>Minimum Bet: </td>
                                <td className="align-right">${this.props.selectedGame.minimum_bet}</td>
                            </tr>

                            <tr>
                                <td>Increment:</td>
                                <td className="align-right">${this.props.selectedGame.increment}</td>
                            </tr>

                            <tr>
                                <td>Expiry Date:</td>
                                <td className="align-right">{this.props.selectedGame.expiry_date}</td>
                            </tr>

                            <tr>
                                <td>Time Left:</td>
                                <td className="align-right">
                                    {this.props.selectedGame.expiry_date != 'When Closed' ? Math.round((new Date(this.props.selectedGame.expiry_date) - new Date()) / 1000 / 60 / 60 / 24) + ' days' : 'No Limit'}
                                    
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="betting-container container" id="bet-pool">
                    <div id="bet-pool-ring">
                       <h1>${this.props.selectedGame.pool}</h1>
                    </div>
                </div>
                <div className="betting-container container" id="bet-controls">
                    <form>
                        <input type="number" placeholder="Bet Amount" min={this.props.selectedGame.minimum_bet} step={this.props.selectedGame.increment}></input>
                        <select>
                            <option>Kyllä</option>
                            <option>Ei</option>
                        </select>
                        <button>Place Bet</button>
                    </form>
                </div>
            </div>
        )
    }
}