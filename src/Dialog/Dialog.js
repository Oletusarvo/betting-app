function Dialog({text, options}){

    let renderedOptions = [];
    options.forEach(option => renderedOptions.push(
        <option key={`option-${option}`}>{option}</option>
    ));

    return (
        <div className="flex-column gap-s center-all">
            <div id="dialog-text">{text}</div>
            <div id="dialog-buttons" className="flex-row gap-s center-all">
                <select name="bet-side">{renderedOptions}</select>
            </div>
        </div>
    );
}

export default Dialog;