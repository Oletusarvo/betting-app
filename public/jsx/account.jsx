class Account extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            gamelist : [],
            loading : true
        }
    }

    render(){
        if(this.props.user === undefined){
            return <Forbidden/>
        }
        else{
            return (
                <div className="page" id="account-page">
                    <div id="account-info">
                        <h1>Your Account</h1>
                    </div>
                    <GameList 
                        gamelist={this.state.gamelist} 
                        loading={this.state.loading} 
                        deleteEnabled={true} 
                        gameCloseFunction={this.props.gameCloseFunction} 
                        title="Bets Created By You"
                    />
                </div>
            );
        }
    }

    componentDidMount(){
        if(this.props.user && this.state.gamelist.length == 0){
            const req = new XMLHttpRequest();
            req.open('GET', `/gamelist/${this.props.user.username}`, true);
            req.setRequestHeader('Content-Type', 'application/json');
            req.setRequestHeader('auth', this.props.token);
            req.send();

            req.onload = () => {
                if(req.status == 200){
                    this.state.gamelist = JSON.parse(req.response);
                    this.state.loading = false;
                    this.setState(this.state);
                }
            }
        }
    }
}