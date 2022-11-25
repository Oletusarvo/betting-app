import React, {useState, useEffect, useContext, useRef} from 'react';
import {useParams} from 'react-router-dom';
import Loading from '../Loading/Loading.js';
import Header from './Header.js';
import Info from './Info.js';
import Pool from './Pool.js';
import Form from './Form.js';
import Ticket from './Lottery/Ticket.js';
import LotteryInfo from './Lottery/LotteryInfo.js';
import AppContext from '../Contexts/AppContext.js';
import GameContext from '../Contexts/GameContext.js';
import langStrings from '../lang.js';

import './Style.scss';

function Betting() {
    const {id} = useParams();
    const {user, socket, setUser, currencyPrecision, lang} = useContext(AppContext);

    const game = useRef(0);
    const bet = useRef(0);
    const [state, setState] = useState();

    useEffect(() => {
        socket.emit('join_room', {id, username: user.username}, gameData => {
            const {newGame, newBet} = gameData;
            game.current = newGame;
            bet.current = newBet;

            setState({
                game: game.current,
                bet: bet.current
            });
        });

        socket.on('game_update', data => {
            if(data.id !== game.current.id) return;
            
            game.current = data;
            setState({
                bet: bet.current,
                game: game.current,
            })
        });

        socket.on('bet_error', message => alert(`Veto hylätty! Syy: ${message}`));

        return () => {
            socket.off('game_update');
            socket.off('bet_error');
            socket.emit('leave_room', id);
        }

    }, []);

    function placeBet(row = undefined){
        const amount = game.current.minimum_bet;
        if(amount == 0){
            const cannotBetMessage = 'Et voi veikata tällä hetkellä.';
            alert(cannotBetMessage);
            return;
        }

        const confirmMessage = `Olet veikkaamassa määrällä ${amount}. Oletko varma?`;
        const c = confirm(confirmMessage);
        if(!c) return;


        const sideSelector = document.querySelector('#bet-options');
        const side = sideSelector ? sideSelector.value : row;
        const data = {
            amount,
            username : user.username,
            side: side,
            game_id: id,
        };

        socket.emit('bet_place', data, update => {
            const {acc, game, newBet} = update;
            
            game.current = game;
            bet.current = newBet;
            setState({
                game : game.current,
                bet: bet.current,
            });

            setUser(acc);
        });
    }

    function raise(){
        const amount = bet.current ? game.current.minimum_bet - bet.current.amount + game.current.increment : game.current.minimum_bet + game.current.increment;
        if(amount == 0){
            const cannotBetMessage = 'Et voi veikata tällä hetkellä.';
            alert(cannotBetMessage);
            return;
        }

        const confirmMessage = `Olet veikkaamassa määrällä ${amount}. Oletko varma?`;
        const c = confirm(confirmMessage);
        if(!c) return;

        const side = document.querySelector('#bet-options').value;
        const data = {
            amount,
            username : user.username,
            side,
            game_id: id,
        };

        socket.emit('bet_place', data, update => {
            const {acc, game, newBet} = update;
            
            game.current = game;
            bet.current = newBet;
            setState({
                game : game.current,
                bet: bet.current,
            });

            setUser(acc);
        });
    }

    function call(){
        const amount = game.current.minimum_bet - bet.current.amount;
        if(amount == 0){
            const cannotBetMessage = 'Et voi veikata tällä hetkellä.';
            alert(cannotBetMessage);
            return;
        }

        const confirmMessage = `Olet vastaamassa määrällä ${amount}. Oletko varma?`;
        const c = confirm(confirmMessage);
        if(!c) return;

        const data = {
            amount,
            username : user.username,
            side : bet.current.side,
            game_id: id,
        };

         socket.emit('bet_place', data, update => {
            const {acc, game, newBet} = update;
            
            game.current = game;
            bet.current = newBet;
            setState({
                game : game.current,
                bet: bet.current,
            });

            setUser(acc);
        });
    }
       
    if(!state){
        return <Loading title='Ladataan vetoa...'/>
    }
    else{
        const isExpired = new Date().getTime() >= new Date(state.game.expiry_date).getTime();

        return (
            <div className="flex-column fill gap-s w-100 pad overflow-y-scroll" id="betting-page">
                <GameContext.Provider value={{game: state.game, bet: state.bet, isExpired, setGameState : setState, placeBet, raise, call}}>
                    <Header/>

                    {
                        state.game.type === 'Boolean' || state.game.type === 'Multi-Choice' ? 
                            <>
                                <Info/>
                                <Pool/>
                                <Form/> 
                            </>
                         :
                            <>
                                <LotteryInfo/>
                                <Pool/>
                                <Ticket/>
                            </>
                    }
                   
                </GameContext.Provider>
            </div>
        );
    }
}

export default Betting;