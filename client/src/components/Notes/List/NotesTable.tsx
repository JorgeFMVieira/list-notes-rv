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
import { useNavigate } from 'react-router-dom';

const NotesTable = (props: any) => {
    const { isUserLoggedIn, currentUser, setCurrentUser } = useAuth();
    const service: NotesService = new NotesService();
    const [currentPage, setCurrentPage] = useState(1);
    const [notes, setNotes] = useState<GetAllNotes[]>([]);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const GetNotes = async () => {
        var data: ListNotes = {
            token: currentUser?.token,
            search: props.search,
            currentPage: currentPage
        }
        setLoading(true);
        await service.ListNotes(data)
            .then((response: any) => {
                if(response.tokenValid === false){
                    localStorage.removeItem('user');
                    setCurrentUser(null);
                    navigate("/");
                }
                setNotes(response.obj);
                setTotalPages(response.totalPages);
                setLoading(false);
            })
            .catch(error => {
                setLoading(false);
                console.log(error);
            });
    }

    const handlePageChange = (event: ChangeEvent<unknown>, page: number) => {
        setCurrentPage(page);
    };

    useEffect(() => {
        GetNotes();
    }, [props.search, currentPage, props.changed]);

    useEffect(() => {
        setCurrentPage(1);
    }, [props.search]);

    return (
        <div>
            {loading === true ?
                <Box style={{ width: '100%', marginTop: '25px' }}>
                    <LinearProgress style={{ backgroundColor: '#202020', color: 'red' }} />
                </Box>
                :
                <>
                    {notes.length === 0 ?
                        props.search !== "" ?
                            <p className={styles.notesNotFound}>Não foram encontras notas.</p>
                            : <p className={styles.notesNotFound}>Parece que não possui nenhuma nota. Crie uma já.</p>
                        :
                        <>
                            <div className={styles.notesListAllNotes}>
                                {notes.map((note: GetAllNotes) => (
                                    <div key={note._id} className={styles.AllNotesItem} onClick={() => {props.setCurrentNote(note._id); props.editNote === true && props.currentNote === note._id ? props.setEditNote(false) : props.setEditNote(true); props.setCreateOpen(false)}}>
                                        {note.title}
                                    </div>
                                ))}
                            </div>
                            <div className={styles.notesListPagination}>
                                <Pagination
                                    className={styles.pagination}
                                    count={totalPages}
                                    page={currentPage}
                                    siblingCount={1}
                                    boundaryCount={1}
                                    color="standard"
                                    shape="rounded"
                                    onChange={handlePageChange}
                                    showFirstButton
                                    showLastButton
                                />
                            </div>
                        </>
                    }
                </>
            }
        </div>
    )
}

export default NotesTable