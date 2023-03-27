const db = require('../dbconfig');

class Notifier{
    constructor(){
        this.sockets = new Map(); //Maps connected sockets to username.
    }

    registerSocket(username, socket){
        this.sockets.set(username, socket);
    }

    unregisterSocket(username){
        this.sockets.delete(username);
    }

    async send(note){
        await db('notes').insert(note);

        const socket = this.sockets.get(note.username);
        if(socket !== undefined){
            socket.emit('notification', note);
        }
    }
}

module.exports = Notifier;