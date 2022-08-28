class Loading extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div className="page" id="loading-page">
                <LoadingRing/>
                <div id="message"><h3>{this.props.title}</h3></div>
            </div>
        )
    }
}