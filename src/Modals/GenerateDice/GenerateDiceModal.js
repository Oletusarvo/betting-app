import { useContext } from "react";
import AppContext from "../../Contexts/AppContext";

function GenerateDiceModal(){

    const {socket, user, setIsMining, setUser, isMining, currencyPrecision} = useContext(AppContext);

    function mine(amount){
        const miningTime = 15000 / currencyPrecision; //Time in milliseconds it takes to generate a die.
        setIsMining(true);    

        return new Promise((resolve, reject) => {
            setTimeout(() => {
                setIsMining(false);
                resolve();
            }, amount * miningTime);
        });
    }

    async function submit(e){
        e.preventDefault();
        const form = e.target;
        const amount = form.amount.valueAsNumber * currencyPrecision;
        await mine(amount);

        socket.emit('coins_generate', {amount, username: user.username}, update => {
            setUser(update);
        });
    }

    return (
        <div className="modal">
            <header className="flex-row center-all">Tuota noppia</header>
            <div className="content glass flex-column gap-s bg-fade">
                <p>
                    Käytä tätä lomaketta luodaksesi lisää noppia käytettäväksi. Yhden nopan luomiseen menee 15 sekuntia. Esim. neljän nopan tuottamiseen menee minuutti.
                </p>
                <br/>
                <form onSubmit={submit}>
                    <label>Määrä:</label>
                    <input name="amount" type="number" step="0.01" min="0.01" defaultValue={1}></input>
                    <button type="submit" disabled={isMining}>Tuota</button>
                </form>
            </div>
            <footer></footer>
        </div>
    );
}

export default GenerateDiceModal;