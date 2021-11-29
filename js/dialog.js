class BetDialog extends React.Component{
    render(){
        return (
            <div className="dialog-window" id="bet-dialog">
                <input className="dialog-input" type="number" min={this.props.minBet || 0.01}/>
                <div className="dialog-buttons">
                    <button className="dialog-button">Ok</button>
                    <button className="dialog-button">Cancel</button>
                </div>
            </div>
        )
    }
}