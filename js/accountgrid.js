class AccountGrid extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div id="grid-account" className="grid-item">

                <table id="account-table">
                    <tbody>
                        <tr>
                            <td className="table-label">
                                Balance:
                            </td>

                            <td id="output-account-balance" className="table-output">
                                {this.props.balance}{this.props.currencySymbol}
                            </td>
                        </tr>

                        <tr>
                            <td className="table-label">
                                Debt:
                            </td>

                            <td id="output-account-debt" className="table-output">
                                {this.props.debt}{this.props.currencySymbol}
                            </td>
                        </tr>

                        <tr>
                            <td className="table-label">
                                Profit:
                            </td>

                            <td id="output-account-profit"
                                className="table-output"
                                style={this.props.profit >= 0 ? {color : "lime"} : {color : "red"}}
                            >
                                {this.props.profit}{this.props.currencySymbol}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}