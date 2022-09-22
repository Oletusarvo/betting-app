import './Style.scss';
import {useState, useContext} from 'react';
import AppContext from '../../Contexts/AppContext';
import GameContext from '../../Contexts/GameContext';

function Ticket(props){
    const {placeBet, game} = useContext(GameContext);
    const [numbers, setNumbers] = useState("");
    const maxLength = game.row_size;
    const numberSeparator = ', ';

    function reset(){
        const numBtns = document.querySelectorAll('.number-btn');
        numBtns.forEach(btn => btn.classList.contains('selected') ? btn.classList.remove('selected') : 0);
        setNumbers("");
    }

    function input(n){
        const newNumbers = numbers === "" ? [] : numbers.split(numberSeparator);
        const index = newNumbers.findIndex(item => item == n);

        //Leave selected numbers to be a different color.
        const btn = document.querySelector(`#n-btn-${n}`);
        if(index !== -1){
            newNumbers.splice(index, 1);
            btn.classList.remove('selected');
        }
        else{
            if(newNumbers.length === maxLength) return;
            newNumbers.push(n);
            btn.classList.add('selected')
        }

        newNumbers.sort((a, b) => a - b);
        setNumbers(newNumbers.join(numberSeparator));
    }

    function add(){
        const row = [...numbers.split(numberSeparator)];
        placeBet(row);
        reset();
    }

    const numberButtons = [];
    for(let n = 1; n <= 40; ++n){
        numberButtons.push(
            <div id={`n-btn-${n}`} className="number-btn flex-column center-all" key={`n-btn-${n}`} onClick={() => input(n)}>{n}</div>
        );
    }

    const displayNumbers = [];
    const ns = numbers.split(numberSeparator);

    if(ns[0] !== ""){
        for(let n of ns){
            displayNumbers.push(
                <div className="display-number" key={n}><div>{n}</div></div>
            )
        }
    }
   
    return (
        <div className="container glass" id="lottery-form">
            <div id="number-buttons">{numberButtons}</div>
            <button id="send-btn" onClick={add} disabled={numbers.split(numberSeparator).length < maxLength}>Add</button>
        </div>
    );
}

export default Ticket;