import React, { ChangeEvent, useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext';
import styles from './Notes.module.css';
import NotesTable from '../../components/Notes/List/NotesTable';
import NotesSearch from '../../components/Notes/List/NotesSearch/NotesSearch';
import CreateNotes from '../../components/Notes/Create/CreateNotes';
import NotesInfo from '../../components/Notes/NotesInfo/NotesInfo';
import NotesDelete from '../../components/Notes/List/NotesDelete/NotesDelete';

//<NotesDelete OnClickYes={() => deleteNote()} OnClickNo={() => setDeleted(false)} IsOpen={deleted} text={`Deseja eliminar a nota: ${currentNote}`} title={"Eliminar"} />
const Notes = () => {

    const [currentNote, setCurrentNote] = useState("");
    const [search, setSearch] = useState("");
    const [createOpen, setCreateOpen] = useState(false);
    const [editNote, setEditNote] = useState(false);
    const [changed, setChanged] = useState(false);
    const [isDeleteOpen, setDeleteOpen] = useState(false);
    const [currentNoteTitle, setCurrentNoteTitle] = useState("");

    return (
        <div className={styles.notesContainer}>
            <NotesDelete setEditNote={setEditNote} setCurrentNote={setCurrentNote} setChanged={setChanged} currentNote={currentNote} setIsOpen={setDeleteOpen} IsOpen={isDeleteOpen} text={`Deseja eliminar a nota: ${currentNoteTitle}`} title={"Eliminar"} />

            <div className={styles.notes}>
                <div className={styles.notesList}>
                    <div className={styles.notesListHeader}>
                        <span>Notas</span>
                    </div>
                    <CreateNotes setCreateOpen={setCreateOpen} createOpen={createOpen} setEditNote={setEditNote} setCurrentNote={setCurrentNote} />
                    <NotesSearch search={search} setSearch={setSearch} />
                    <NotesTable setDeleteOpen={setDeleteOpen} setCurrentNoteTitle={setCurrentNoteTitle} setChanged={setChanged} changed={changed} setEditNote={setEditNote} editNote={editNote} createOpen={createOpen} setCreateOpen={setCreateOpen} currentNote={currentNote} setCurrentNote={setCurrentNote} search={search} />
                </div>
                {createOpen || editNote ?
                    <div className={styles.notesInfo}>
                        <NotesInfo setChanged={setChanged} changed={changed} currentNote={currentNote} setCurrentNote={setCurrentNote} editNote={editNote} setEditNote={setEditNote} createOpen={createOpen} setCreateOpen={setCreateOpen} />
                    </div>
                    : null}
            </div>
        </div>
    )
}

export default Notes