import './Style.scss';
import DeleteButton from './DeleteButton';
function OptionToken({content, deleteOption}){
    //const {deleteOption} = useContext(CreateGameContext);

    return (
        <div className="option-token flex-row center-all pad gap-s">
            <span>{content}</span>
            <DeleteButton deleteOption={deleteOption}/>
        </div>
    );
}

export default OptionToken;