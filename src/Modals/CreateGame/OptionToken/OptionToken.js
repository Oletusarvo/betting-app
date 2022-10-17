import './Style.scss';
import {useContext} from 'react';
import CreateGameContext from '../../../Contexts/CreateGameContex';

function OptionToken({content}){
    const {deleteOption} = useContext(CreateGameContext);
    return (
        <div className="option-token flex-column center-all pad">
            <span>{content}</span>
            <DeleteButton deleteOption={ () => deleteOption(content) }/>
        </div>
    );
}

export default OptionToken;