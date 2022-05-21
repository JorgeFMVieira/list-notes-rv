import React, { useEffect, useState } from 'react'
import { AiOutlineClose, AiOutlineSearch } from 'react-icons/ai';
import { useAuth } from '../../context/AuthContext';
import { ListNotes } from '../../models/Notes/ListNotes';
import { NotesService } from '../../services/Notes/NotesService';
import styles from './Notes.module.css';

const Notes = () => {


    const { isUserLoggedIn, currentUser } = useAuth();
    const service: NotesService = new NotesService();
    const [search, setSearch] = useState("");

    const GetNotes = async () => {
        var data: ListNotes = {
            token: currentUser?.token,
            search: search
        }
        await service.ListNotes(data)
            .then(response => {
                console.log(response);
            })
            .catch(error => {
                console.log(error);
            });
    }

    useEffect(() => {
        GetNotes();
    }, []);


    return (
        <div className={styles.notes}>
            <div className={styles.notesList}>

            </div>
        </div>
    )
}

export default Notes