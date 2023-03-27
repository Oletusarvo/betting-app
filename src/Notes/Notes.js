import { useEffect, useContext } from "react";
import AppContext from "../Contexts/AppContext";

function Notes(props){
    const {socket, user} = useContext(AppContext);
    const {notes, setNotes, deleteNote} = props;

    useEffect(() => {
        socket.emit('notes_seen', user.username, res => {
            if(res === 0){  
                const updatedNotes = [...notes];
                updatedNotes.forEach(note => note.seen = true);
                setNotes(updatedNotes);
            }
        });
    });

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
                                <a onClick={() => deleteNote(item.id)}>Poista</a>
                            </li>
                        )
                    })
                }
            </ul>
        </div>
    );
}

export default Notes;