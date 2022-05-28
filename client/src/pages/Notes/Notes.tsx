import React, { ChangeEvent, useEffect, useState } from 'react'
import { AiOutlineClose, AiOutlineSearch } from 'react-icons/ai';
import { useAuth } from '../../context/AuthContext';
import { GetAllNotes } from '../../models/Notes/GetAllNotes';
import { ListNotes } from '../../models/Notes/ListNotes';
import { NotesService } from '../../services/Notes/NotesService';
import styles from './Notes.module.css';
import Pagination from '@mui/material/Pagination';
import './Pagination.css';
import { Box, CircularProgress, Divider, LinearProgress } from '@material-ui/core';

const Notes = () => {

    const { isUserLoggedIn, currentUser } = useAuth();
    const service: NotesService = new NotesService();
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [notes, setNotes] = useState<GetAllNotes[]>([]);
    const [currentNote, setCurrentNote] = useState("");
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);

    const GetNotes = async () => {
        var data: ListNotes = {
            token: currentUser?.token,
            search: search,
            currentPage: currentPage
        }
        setLoading(true);
        await service.ListNotes(data)
            .then(response => {
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
    }, [search, currentPage, currentNote]);

    useEffect(() => {
        setCurrentPage(1);
    }, [search]);

    return (
        <div className={styles.notes}>
            <div className={styles.notesList}>
                <div className={styles.notesListHeader}>
                    <span>Notas</span>
                </div>
                <div className={styles.notesListSearch}>
                    <input type="text" value={search} placeholder="Pesquise..." onChange={(e) => setSearch(e.target.value)} className={styles.searchNotes} />
                    {search !== "" ?
                        <AiOutlineClose className={styles.notesListSearchIcon} onClick={() => setSearch("")} />
                        : <AiOutlineSearch className={styles.notesListSearchIcon} />
                    }
                </div>
                {loading === true ?
                    <Box style={{ width: '100%', marginTop: '25px' }}>
                        <LinearProgress style={{ backgroundColor: '#202020', color: 'red' }} />
                    </Box>
                    :
                    <div className={styles.notesListAllNotes}>
                        {notes.map((note: GetAllNotes) => (
                            <div key={note._id} className={styles.AllNotesItem} onClick={() => setCurrentNote(note._id)}>
                                {note.title}
                            </div>
                        ))}
                    </div>}
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
            </div>
        </div>
    )
}

export default Notes