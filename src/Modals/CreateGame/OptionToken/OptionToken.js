import './Style.scss';

function OptionToken({content}){
    return (
        <div className="option-token flex-column center-all pad">
            <span>{content}</span>
        </div>
    );
}

export default OptionToken;