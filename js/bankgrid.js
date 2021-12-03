class BankGrid extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div id="grid-bank" className="grid-item">
                <table id="bank-table">
                    <tbody>
                        <tr>
                            <td className="table-label">Circulation:</td>
                            <td className="table-output" id="output-bank-circulation">{this.props.circulation}{this.props.currencySymbol}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}