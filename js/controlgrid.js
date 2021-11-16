class ControlGrid extends React.Component{
    constructor(props){
        super(props);
    }


    render(){
        return(
            <div id="grid-controls" className="grid-item">
                <input className="input-field" id="input-bet-amount" type="number" step="0.1" min={this.props.minBet}/>
                <button 
                    className="control-button"
                    id="button-place-bet" 

                    onClick={this.props.placeBetFunction}>Place Bet</button><br/>

                <select className="control-button" id="input-game-bool">
                    <option>True</option>
                    <option>False</option>
                </select>

                <button 
                    className="control-button"
                    id="button-fold"
                    onClick={this.props.foldFunction}>Fold</button>

                <button 
                    className="control-button"
                    id="button-end-game" 
                    style={{background : "red"}}
                    onClick={this.props.endGameFunction}>End Game</button>

                <input className="input-field" id="input-bank" type="number" step="0.01" min="1"/>
                <button 
                    className="control-button"
                    id="button-pay-debt" 
                    onClick={this.props.payDebtFunction}>Pay Debt</button>

                <button 
                    className="control-button"
                    id="button-loan" 
                    onClick={this.props.loanFunction}>Loan</button>
            </div>
        );
    }
}