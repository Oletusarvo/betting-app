class GamePool extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div className="grid-item" id="game-pool">
                <span className="data-output" id="output-game-pool">{this.props.pool}</span>
                <span className="data-output" id="output-game-pool-currencySymbol">{this.props.currencySymbol}</span>
            </div>
        )
    }
}