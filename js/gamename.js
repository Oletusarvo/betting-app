class GameName extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div className="grid-item" id="game-name">{this.props.gameName}</div>
        )
    }
}