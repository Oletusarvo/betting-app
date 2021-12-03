class BetDialog extends React.Component{
    render(){
        return (
            <dialog className="dialog-box" id="bet-dialog" open>
                <input id="input-bet-amount" className="dialog-input"/>
                <div className="dialog-button-row">
                    <button id="place-bet-ok" className="dialog-button">OK</button>
                    <button id="place-bet-cancel" className="dialog-button">Cancel</button>
                </div>
            </dialog>
        )
    }
}