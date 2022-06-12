import React, { useEffect, useState } from 'react'
import { AiOutlineClose, AiOutlineWarning } from 'react-icons/ai';
import { useAuth } from '../../../../context/AuthContext';
import { DetailsNote } from '../../../../models/Notes/DetailsNote';
import { NotesService } from '../../../../services/Notes/NotesService';
import styles from '../NotesInfo.module.css';
import { Grid, Divider, Box, LinearProgress, CircularProgress } from '@material-ui/core';
import { CreateNote } from '../../../../models/Notes/CreateNote';

const CreateNoteInfo = (props: any) => {

    const { isUserLoggedIn, currentUser, setCurrentUser } = useAuth();
    const service: NotesService = new NotesService();
    const [note, setNote] = useState<DetailsNote>(new DetailsNote());
    const [loading, setLoading] = useState(true);
    const [loadingBtn, setLoadingBtn] = useState(false);
    const [error, setError] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const CreateNote = async () => {
        var data: CreateNote = {
            ...note,
            token: currentUser?.token
        };
        await service.CreateNote(data)
            .then(response => {
                if (response.success === false) {
                    setError(true);
                    setErrorMsg(response.message);
                    setLoadingBtn(false);
                    setLoading(false);
                    setTimeout(() => {
                        setError(false);
                    }, 5000);
                    return;
                }
                props.setChanged(true);
                props.setCreateOpen(false);
            })
            .catch(error => {
                console.log(error);
            })
    }

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 450);
    }, [props.createOpen]);

    return (
        <div className={styles.noteMain}>
            {loading === true ?
                <Box style={{ width: '100%', marginTop: '25px' }}>
                    <LinearProgress style={{ backgroundColor: '#202020', color: 'red' }} />
                </Box>
                :
                <>
                    <div className={styles.noteHeader}>
                        <span>Criar Nota</span>
                        <span className={styles.noteHeaderIcon}><AiOutlineClose onClick={() => { props.setCreateOpen(false); props.setCurrentNote("") }} /></span>
                    </div>
                    <div className={styles.noteContent}>
                        <div className={styles.noteItem}>
                            <span>Título: </span>
                            <input type="text" onChange={(e) => setNote({ ...note, title: e.target.value })} placeholder="Título" />
                        </div>
                        <div className={`${styles.noteItem} ${styles.noteItemDesc}`}>
                            <span>Descrição: </span>
                            <textarea placeholder='Descrição' defaultValue={note.content} onChange={(e) => setNote({ ...note, content: e.target.value })}>

                            </textarea>
                        </div>
                        {error === true ?
                            <div className={`${styles.noteItem} ${styles.noteError}`}>
                                <p><AiOutlineWarning style={{ fontSize: '1.5em' }} />&nbsp;{errorMsg}</p>
                            </div>
                            : null}
                    </div>
                    <div className={styles.noteButtons}>
                        {loadingBtn === true ?
                            <span className={styles.noteBtn}><CircularProgress
                                size={30}
                                thickness={3}
                            /></span>
                            : <button className={styles.noteBtn} onClick={() => CreateNote()}>Criar</button>}
                    </div>
                </>
            }
        </div>
    )
}

export default CreateNoteInfo