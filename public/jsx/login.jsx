class Login extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div className="page" id="login-page">
                <h1>Login</h1>
                <form id="login-form">
                    <input name="username" placeholder="Username"></input>
                    <input name="password" placeholder="Password" type="password"></input>
                    <button type="submit">Login</button>
                </form>
            </div>
        );
    }

    componentDidMount(){
        const form = document.querySelector('#login-form');
        form.addEventListener('submit', e => {
            e.preventDefault();

            const data = {
                username : form.username.value,
                password : form.password.value,
            };

            this.props.login(data);
        });
    }
}