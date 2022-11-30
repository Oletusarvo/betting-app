import { useContext } from "react";
import AppContext from "../../Contexts/AppContext";

function GenerateDiceModal(){

    const {socket, user, setIsMining, setUser, isMining, currency} = useContext(AppContext);

    function mine(amount){
        const miningTime = 15000 * amount; //Time in milliseconds it takes to generate a die.
        setIsMining(true);    

        return new Promise((resolve, reject) => {
            setTimeout(() => {
                setIsMining(false);
                resolve();
            }, miningTime);
        });
    }

    async function submit(e){
        e.preventDefault();
        const form = e.target;
        const amount = form.amount.valueAsNumber;
        await mine(amount);

        socket.emit('coins_generate', {amount, username: user.username}, update => {
            setUser(update);
        });
    }

    const amountStep = 1 / Math.pow(10, currency.precision);
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
                    <input name="amount" type="number" step={amountStep} min={amountStep} defaultValue={1}></input>
                    <button type="submit" disabled={isMining}>Tuota</button>
                </form>
            </div>
            <footer></footer>
        </div>
    );
}

export default GenerateDiceModal;