import React from 'react';

class NewGame extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            loading : false,
            success : false
        }

        this.success = this.success.bind(this);
        this.failure = this.failure.bind(this);
        this.newgame = this.newgame.bind(this);
    }

    success(){
        return <h1>Game creation success!</h1>
    }

    failure(){
        return <h1>Game creation failure!</h1>
    }

    newgame(game){
        const state = this.props.state;
        state.action = 'newgame';
        this.props.updateState(state, () => {
            const req = new XMLHttpRequest();
            req.open('POST', '/games', true);
            req.setRequestHeader('Content-Type', 'application/json');
            req.setRequestHeader('auth', state.token);

            req.send(JSON.stringify(game));

            req.onload = () => {
                state.action = 'none';

                if(req.status == 200){
                    this.props.updateState(state, () => location.assign('/#/games'));
                }
                else{
                    alert(`Bet creation failed! Code: ${req.status}`);
                }

                this.props.updateState(state);
            }
        });
    }

    render(){
        if(this.props.state.user === undefined){
            return <Forbidden/>
        }
        else{
            const ring = this.state.loading ? <LoadingRing/> : <></>;
            return (
                <div className="page" id="new-game-page">
                    <h1>Create new Game</h1>
                    <form id="new-game-form">
                        <input name="title" placeholder="Enter game title" required={true} maxLength={50}></input>
                        <input name="minimumBet" type="number" min="0.01" step="0.01" placeholder="Enter minimum bet" required={true}></input>
                        <input name="increment" type="number" min="0.01" step="0.01" defaultValue={0.01} placeholder="Bet Increment"></input>
                        <input name="expiryDate" type="date" placeholder="Enter expiry date"></input>
                        <textarea name="available_to" maxLength={500} placeholder="Space-separated list of users who will be able to participate."></textarea>
                        <button type="submit">Create</button>
                    </form>
                    {ring}
                </div>
            );
        }
       
    }

    componentDidMount(){
        if(this.props.state.user){
            const form = document.querySelector('#new-game-form');
            form.addEventListener('submit', e => {
                e.preventDefault();

                const game = {
                    game_title : form.title.value,
                    minimum_bet : form.minimumBet.value,
                    expiry_date : form.expiryDate.value,
                    increment : form.increment.value,
                    created_by : this.props.state.user.username,
                    //available_to : form.available_to.value
                };

               this.newgame(game);
            });
        }
        
    }
}

export default NewGame;