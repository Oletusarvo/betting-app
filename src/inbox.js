class Inbox{
    constructor(messages){
        this.messages = [...messages];
    }

    addMessage(message){
        this.messages.push(message);
    }

    getUnseenCount(){
        return this.messages.reduce((acc, cur) => acc += !cur.seen, 0);
    }
}

export default Inbox;