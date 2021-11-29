class ControlGrid extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div id="grid-controls" className="grid-item">
                
                <button 
                    className="control-button"
                    id="button-place-bet" 

                    onClick={
                        this.props.mustCall ?
                        this.props.callFunction :
                        this.props.placeBetFunction}>
                            
                            { this.props.mustCall ? "Call" : "Place Bet" }</button>

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
                    onClick={this.props.endGameFunction}>End Game</button>

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