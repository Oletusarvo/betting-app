import React, {useState, useEffect, useContext, useRef} from 'react';
import {useParams} from 'react-router-dom';
import Loading from '../Loading/Loading.js';
import Header from './Header.js';
import Info from './Info.js';
import Pool from './Pool.js';
import Form from './Form.js';
import {loadGame, loadBet} from './Api';
import AppContext from '../Contexts/AppContext.js';
import GameContext from '../Contexts/GameContext.js';

import './Style.scss';

function Betting(props) {
    const {game_id} = useParams();
    const {user, token, socket} = useContext(AppContext);

    const game = useRef(0);
    const bet = useRef(0);
    const minBet = useRef(0);
    const [state, setState] = useState();

    useEffect(() => {
        async function getData(){
            try{
                game.current = await loadGame(game_id, token);
                bet.current = await loadBet(user.username, game_id, token);
                minBet.current = bet.current ? game.current.minimum_bet - bet.current.amount : game.current.minimum_bet;

                setState({
                    game: game.current,
                    bet : bet.current
                });
            }
            catch(err){
                console.log(err.message);
            }
        }

        getData();

        socket.on('game_update', async data => {
            bet.current = await loadBet(user.username, game.current.game_id, token);
            game.current = JSON.parse(data);
            minBet.current = bet.current ? game.current.minimum_bet - bet.current.amount : game.current.minimum_bet;
            
            setState({
                game : game.current,
                bet : bet.current
            });

            getData();
        });
    }, []);

    if(!state){
        return <Loading title="Loading game..." />
    }
    else{
        const isExpired = new Date().getTime() >= new Date(state.game.expiry_date).getTime();
        
        return (
            <div className="flex-column fill gap-default w-100 pad overflow-y-scroll" id="betting-page">
                <GameContext.Provider value={{game: state.game, bet: state.bet, isExpired, setGameState : setState}}>
                    <Header/>
                    <Info/>
                    <Pool/>
                    <Form/>
                </GameContext.Provider>
            </div>
        );
    }
}

export default Betting;