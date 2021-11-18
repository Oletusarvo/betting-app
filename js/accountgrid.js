class AccountGrid extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div id="grid-account" className="grid-item">
                <span className="data-output" id="output-account-balance">Balance: {this.props.balance}{this.props.currencySymbol}</span><br/>
                <span className="data-output" id="output-account-debt">Debt: {this.props.debt}{this.props.currencySymbol}</span><br/>

                <span>Profit: </span>
                <span 
                    className="data-output" 
                    id="output-account-profit"
                    style={this.props.profit >= 0 ? {color : "lime"} : {color : "red"}}
                    >{this.props.profit}{this.props.currencySymbol}</span>
            </div>
        );
    }
}