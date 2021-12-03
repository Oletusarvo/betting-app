class GameName extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div 
                className="grid-item" 
                id="game-name"
                onClick={this.props.setNameFunction}>{this.props.gameName}</div>
        )
    }
}