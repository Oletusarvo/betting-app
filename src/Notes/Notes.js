import { useEffect, useState, useContext } from "react";
import AppContext from "../Contexts/AppContext";
import './Style.scss';

function Notes(props){
    const {notes, deleteNote, setNotes, socket, user} = useContext(AppContext);

    useEffect(() => {
        const unseen = notes.filter(note => note.seen == false);
        socket.emit('notes_seen', unseen);
        const newNotes = [...notes];
        newNotes.forEach(note => note.seen = true);
        localStorage.setItem(`betting-app-notes-${user.username}`, JSON.stringify(newNotes));
        setNotes(newNotes);
    }, []);

    const renderNotes = [...notes];
    return (
        <div className="flex-column fill pad w-100 gap-m overflow-y-scroll overflow-x-hide" id="notes-page">
            <h1>Ilmoitukset</h1>
            <ul>
                {
                    renderNotes.sort((a, b) => b.id - a.id).map(item => {
                        return (
                            <li key={item.id}>
                                <span>{item.game_title}</span>
                                <span>{item.message}</span>
                                <button onClick={() => deleteNote(item.id)}>Poista</button>
                            </li>
                        )
                    })
                }
            </ul>
        </div>
    );
}

export default Notes;