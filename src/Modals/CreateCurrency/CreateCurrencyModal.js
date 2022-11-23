import {useState, useContext} from 'react';
import AppContext from '../../Contexts/AppContext';
import '../Style.scss';

function CreateCurrencyModal(props){
    const {socket, user} = useContext(AppContext);

    

    function create(e){
        e.preventDefault();
        const data = {
            symbol: e.target.symbol.value,
            name: e.target.name.value,
            short_name: e.target.short_name.value,
            created_by: user.username, 
            precision: e.target.precision.valueAsNumber,
        }

        socket.emit('currency_create', data, (errcode) => {
            if(errcode !== 0){
                alert(`Valuutan luominen epäonnistui!`);
                return;
            } 

            alert(`Valuutta ${data.name} luotu onnistuneesti!`);
        });
    }

    const maxNameLength = 20;
    const maxDecimals = 8;
    const maxShortLength = 3;
    const maxSymbolLength = 1;

    return (
        <div className="modal">
            <header>Luo Valuutta</header>
            <div className="content glass bg-fade">
                <form onSubmit={create}>
                    <label htmlFor="name">Nimi:</label>
                    <input required name="name" placeholder="Anna valuutan nimi, esim. Euro" maxLength={maxNameLength}></input>
                    <label htmlFor="short_name">Lyhenne:</label>
                    <input required name="short_name" placeholder="Anna valuutan lyhenne, esim. 'eur'" maxLength={maxShortLength}></input>
                    <label htmlFor="symbol">Symboli:</label>
                    <input name="symbol" placeholder="Anna valuutan symboli, esim. '€'" maxLength={maxSymbolLength}></input>
                    <label htmlFor="precision">Desimaalitarkkuus:</label>
                    <input required name="precision" placeholder="Anna valuutan desimaalitarkkuus" type="number" min="1" step="1" max={maxDecimals}></input>
                    <button type="submit">Luo</button>
                </form>
            </div>
            <footer></footer>
        </div>
    );
}

export default CreateCurrencyModal;