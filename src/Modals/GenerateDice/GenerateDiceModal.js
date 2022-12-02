import { useContext } from "react";
import AppContext from "../../Contexts/AppContext";

function GenerateDiceModal(){

    const {socket, user, setIsMining, setUser, isMining, currency} = useContext(AppContext);

    function mine(amount){
        const miningTime = 15000 * amount; //Time in milliseconds it takes to generate a die.
        setIsMining(true);    

        var coinsGenerated = 0;

        return new Promise((resolve,reject) => {
            const inter = setInterval(() => {
                coinsGenerated += 1;
                socket.emit('coins_generate', {amount: 1, username: user.username}, update => {
                    setUser(update);
                    if(coinsGenerated == amount){
                        resolve(inter);
                    }
                });
            }, miningTime / amount);
        });
    }

    async function submit(e){
        e.preventDefault();
        const form = e.target;
        const amount = form.amount.valueAsNumber;
        const inter = await mine(amount);
        clearInterval(inter);
        setIsMining(false);
    }

    const amountStep = 1 / Math.pow(10, currency.precision);
    return (
        <div className="modal">
            <header className="flex-row center-all">Tuota noppia</header>
            <div className="content glass flex-column gap-s bg-fade">
                <p>
                    Käytä tätä lomaketta luodaksesi lisää noppia käytettäväksi. Yhden nopan luomiseen menee 15 sekuntia. Esim. neljän nopan tuottamiseen menee yksi minuutti.
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