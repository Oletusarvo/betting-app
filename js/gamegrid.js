class GameGrid extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div id="grid-game" className="grid-item">
                <div className="grid-item" id="game-name">{this.props.gameName}</div>
                <div className="grid-item" id="game-pool">
                    <span className="data-output" id="output-game-pool">{this.props.pool}</span>
                    <span className="data-output" id="output-game-pool-currencySymbol">{this.props.currencySymbol}</span>
                </div>
            </div>
        );
    }
}