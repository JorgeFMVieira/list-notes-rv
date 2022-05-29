import React, { ChangeEvent, useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext';
import styles from './Notes.module.css';
import NotesTable from '../../components/Notes/List/NotesTable';
import NotesSearch from '../../components/Notes/List/NotesSearch/NotesSearch';
import CreateNotes from '../../components/Notes/Create/CreateNotes';
import NotesInfo from '../../components/Notes/NotesInfo/NotesInfo';


const Notes = () => {

    const [currentNote, setCurrentNote] = useState("");
    const [search, setSearch] = useState("");
    const [createOpen, setCreateOpen] = useState(false);
    const [editNote, setEditNote] = useState(false);
    const [changed, setChanged] = useState(false);

    return (
        <div className={styles.notes}>
            <div className={styles.notesList}>
                <div className={styles.notesListHeader}>
                    <span>Notas</span>
                </div>
                <CreateNotes setCreateOpen={setCreateOpen} createOpen={createOpen} setEditNote={setEditNote} />
                <NotesSearch search={search} setSearch={setSearch} />
                <NotesTable changed={changed} setEditNote={setEditNote} editNote={editNote} setCreateOpen={setCreateOpen} currentNote={currentNote} setCurrentNote={setCurrentNote} search={search} />
            </div>
            {createOpen || editNote ?
                <div className={styles.notesInfo}>
                    <NotesInfo setChanged={setChanged} changed={changed} currentNote={currentNote} editNote={editNote} setEditNote={setEditNote} createOpen={createOpen} setCreateOpen={setCreateOpen} />
                </div>
                : null}
        </div>
    )
}

export default Notes