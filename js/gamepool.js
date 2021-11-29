class GamePool extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div className="grid-item" id="game-pool">
                <div 
                    id="game-pool-border-circle"
                    onClick={this.props.betFunction}
                    style={
                        {borderColor: this.props.mustCall ? "yellow" 
                        : this.props.canBet ? "lime"
                        : "red"}}>
                    <span 
                        className="data-output" 
                        id="output-game-pool">{this.props.pool}<span id="output-game-pool-currencySymbol">{this.props.currencySymbol}</span>
                    </span>
                </div>
            </div>
        )
    }
}