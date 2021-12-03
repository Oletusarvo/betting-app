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

                    onClick={this.props.betFunction}>
                            { this.props.mustCall ? 
                                this.props.lang == 'fin' ? "Vastaa" : "Call" :
                                this.props.lang == 'fin' ? "Veikkaa" : "Place Bet" }</button>

                <select className="control-button" id="input-game-bool">
                    <option>True</option>
                    <option>False</option>
                </select>

                <button 
                    className="control-button"
                    id="button-fold"
                    onClick={this.props.foldFunction}>{this.props.lang == 'fin' ? 'Luovuta' : 'Fold'}</button>

                <button 
                    className="control-button"
                    id="button-end-game" 
                    onClick={this.props.endGameFunction}>{this.props.lang == 'fin' ? 'Lopeta Peli' : 'End Game'}</button>

                <button 
                    className="control-button"
                    id="button-pay-debt" 
                    onClick={this.props.payDebtFunction}>{this.props.lang == 'fin' ? 'Maksa Velka' : 'Pay Debt'}</button>

                <button 
                    className="control-button"
                    id="button-loan" 
                    onClick={this.props.loanFunction}>{this.props.lang == 'fin' ? 'Lainaa' : 'Loan'}</button>
            </div>
        );
    }
}