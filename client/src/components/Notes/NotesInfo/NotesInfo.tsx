import React, { useEffect, useState } from 'react';
import { Box, LinearProgress } from '@material-ui/core';
import styles from './NotesInfo.module.css';
import { AiOutlineClose } from 'react-icons/ai';
import { NotesService } from '../../../services/Notes/NotesService';
import { DetailsNote } from '../../../models/Notes/DetailsNote';
import { useAuth } from '../../../context/AuthContext';
import DetailsNoteInfo from './DetailsNoteInfo/DetailsNoteInfo';
import CreateNoteInfo from './CreateNoteInfo/CreateNoteInfo';

const NotesInfo = (props: any) => {

    const { isUserLoggedIn, currentUser, setCurrentUser } = useAuth();
    const service: NotesService = new NotesService();
    const [note, setNote] = useState<DetailsNote>(new DetailsNote());
    const [noteTitle, setNoteTitle] = useState("");
    const [createNote, setCreateNote] = useState<DetailsNote>(new DetailsNote());
    const [loading, setLoading] = useState(false);

    const GetCurrentNote = async () => {
        var data = {
            note: props.currentNote
        }
        var user = {
            token: currentUser?.token
        }
        setLoading(true);
        await service.DetailsNote(data, user)
            .then(response => {
                setNote(response.obj);
                setLoading(false);
            })
            .catch(error => {
                setLoading(false);
                console.log(error);
            });
    }

    useEffect(() => {
        GetCurrentNote();
    }, [props.currentNote]);

    return (
        <div className={styles.noteInfo}>
            {props.editNote ?
                <DetailsNoteInfo changed={props.changed} setChanged={props.setChanged} currentNote={props.currentNote} setCurrentNote={props.setCurrentNote} setEditNote={props.setEditNote} />
            : <CreateNoteInfo changed={props.changed} setChanged={props.setChanged} setCreateOpen={props.setCreateOpen} createOpen={props.createOpen} setCurrentNote={props.setCurrentNote} />}
        </div>
    )
}

export default NotesInfo