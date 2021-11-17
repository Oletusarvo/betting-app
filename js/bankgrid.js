class BankGrid extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div id="grid-bank" className="grid-item">
                <span className="data-output" id="output-bank-circulation">Circulation: {this.props.circulation}{this.props.currencySymbol}</span><br/>
            </div>
        );
    }
}