import { useContext, useState } from "react";
import AppContext from "../../Contexts/AppContext";
import Loading from '../../Loading/Loading.js';

function GenerateDiceModal(props){

    const {socket, user, setIsMining, setUser} = useContext(AppContext);

    function mine(amount){
        const miningTime = 1000; //Time in milliseconds it takes to generate a die.
        setIsMining(true);    
        console.log(amount);

        return new Promise((resolve, reject) => {
            setTimeout(() => {
                setIsMining(false);
                console.log('Nonii-i')
                resolve();
            }, amount * miningTime);
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

    return (
        <div className="modal">
            <header>Generate Dice</header>
            <div className="content glass flex-column gap-s">
                <form onSubmit={submit}>
                    <label>Amount:</label>
                    <input name="amount" type="number" step="1" min="1"></input>
                    <button type="submit">Inflate</button>
                </form>
            </div>
            <footer></footer>
        </div>
    );
}

export default GenerateDiceModal;