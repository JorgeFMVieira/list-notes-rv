import React, { ChangeEvent, useEffect, useState } from 'react'
import { useAuth } from '../../../context/AuthContext';
import { GetAllNotes } from '../../../models/Notes/GetAllNotes';
import { ListNotes } from '../../../models/Notes/ListNotes';
import { NotesService } from '../../../services/Notes/NotesService';
import Pagination from '@mui/material/Pagination';
import '../../../pages/Notes/Pagination.css';
import { Box, LinearProgress } from '@material-ui/core';
import styles from './NotesTable.module.css';
import { AiOutlineClose, AiOutlineSearch } from 'react-icons/ai';
import { FaRegTrashAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import NotesDelete from './NotesDelete/NotesDelete';

const NotesTable = (props: any) => {
    const { currentUser, setCurrentUser } = useAuth();
    const service: NotesService = new NotesService();
    const [notes, setNotes] = useState<GetAllNotes[]>([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const GetNotes = async () => {
        var data: ListNotes = {
            token: currentUser?.token,
            search: props.search,
        }
        setLoading(true);
        await service.ListNotes(data)
            .then((response: any) => {
                if (response.tokenValid === false) {
                    localStorage.removeItem('user');
                    setCurrentUser(null);
                    navigate("/");
                    return;
                }
                props.setChanged(false);
                setNotes(response.obj);
                setLoading(false);
            })
            .catch(error => {
                setLoading(false);
                console.log(error);
            });
    }

    const convertDate = (e: string, option: string) => {
        var date = e;

        if (option === "dateToString") {
            var onlyDate = date.split("T");
            date = onlyDate[0];
            const [year, month, day] = date.split("-");
            date = day + "/" + month + "/" + year;
        }

        return date;
    }

    useEffect(() => {
        GetNotes();
    }, [props.search, props.changed]);

    return (
        <div className={styles.tableScroll}>
            {loading === true ?
                <Box style={{ width: '100%', marginTop: '25px' }}>
                    <LinearProgress style={{ backgroundColor: '#202020', color: 'red' }} />
                </Box>
                :
                <div>
                    {notes.length === 0 ?
                        props.search !== "" ?
                            <p className={styles.notesNotFound}>Não foram encontras notas.</p>
                            : <p className={styles.notesNotFound}>Parece que não possui nenhuma nota. Crie uma já.</p>
                        :
                        <div className={styles.notesListAllNotes}>
                            {notes.map((note: GetAllNotes) => (
                                <div key={note._id} className={`${styles.AllNotesItem} ${props.currentNote === note._id && props.createOpen === false ? styles.SelectedNote : null}`}>
                                    <div className={styles.NotesItemContainer} onClick={() => { props.setCurrentNote(note._id); props.editNote === true && props.currentNote === note._id ? props.setEditNote(false) : props.setEditNote(true); props.setCreateOpen(false); props.editNote === true && props.currentNote === note._id && props.setCurrentNote("") }}>
                                        <span className={styles.noteTitle}>{note.title}</span>
                                        <span className={styles.noteDate}>{convertDate(note.createdAt.toString(), "dateToString")}</span>
                                    </div>
                                    <span className={styles.noteDelete} onClick={() => { props.setCurrentNote(note._id); props.setDeleteOpen(true); props.setCurrentNoteTitle(note.title) }}><FaRegTrashAlt /></span>
                                </div>
                            ))}
                        </div>
                    }
                </div>
            }
        </div>
    )
}

export default NotesTable