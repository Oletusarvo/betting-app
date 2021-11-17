class AccountGrid extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div id="grid-account" className="grid-item">
                <span className="data-output" id="output-account-balance">Balance: {this.props.balance.toFixed(2)}{this.props.currencySymbol}</span><br/>
                <span className="data-output" id="output-account-debt">Debt: {this.props.debt.toFixed(2)}{this.props.currencySymbol}</span><br/>

                <span>Profit: </span>
                <span 
                    className="data-output" 
                    id="output-account-profit"
                    style={this.props.profit >= 0 ? {color : "green"} : {color : "brown"}}
                    >{this.props.profit.toFixed(2)}{this.props.currencySymbol}</span>
            </div>
        );
    }
}