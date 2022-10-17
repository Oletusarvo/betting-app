import './Style.scss';
import DeleteButton from './DeleteButton';
function OptionToken({content, deleteOption}){
    //const {deleteOption} = useContext(CreateGameContext);

    return (
        <div className="option-token flex-column center-all pad">
            <span>{content}</span>
        </div>
    );
}

export default OptionToken;