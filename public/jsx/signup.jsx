class Signup extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div className="page" id="signup-page">
                <h1>Signup</h1>
                <form id="signup-form">
                    <input name="username" placeholder="Username"></input>
                    <input name="password1" placeholder="Password" type="password"></input>
                    <input name="password2" placeholder="Enter Password Again" type="password"></input>
                    <button type="submit">Signup</button>
                </form>
            </div>
        );
    }

    componentDidMount(){
        const form = document.querySelector('#signup-form');
        form.addEventListener('submit', e => {
            e.preventDefault();

            const data = {
                username : form.username.value,
                password1 : form.password1.value,
                password2 : form.password2.value
            };

            this.props.signup(data);
        });
    }
}