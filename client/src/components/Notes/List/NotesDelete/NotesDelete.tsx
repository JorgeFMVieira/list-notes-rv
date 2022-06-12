import React from 'react'
import styles from './NotesDelete.module.css'
import { AiOutlineClose } from 'react-icons/ai';
import { NotesService } from '../../../../services/Notes/NotesService';
import { DeleteNote } from '../../../../models/Notes/DeleteNote';
import { useAuth } from '../../../../context/AuthContext';

export type NotesDeleteProps = {
    text: string;
    IsOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setChanged: React.Dispatch<React.SetStateAction<boolean>>;
    setEditNote: React.Dispatch<React.SetStateAction<boolean>>;
    setCurrentNote: React.Dispatch<React.SetStateAction<string>>;
    title: string;
    currentNote: string;
}

const NotesDelete = (props: NotesDeleteProps) => {
    const service = new NotesService();
    const { currentUser } = useAuth();

    const DeleteNote = async () => {
        var data: DeleteNote = {
            token: currentUser?.token,
            note: props.currentNote,
        };
        await service.DeleteNote(data)
            .then(response => {
                props.setIsOpen(false);
                props.setCurrentNote("");
                props.setEditNote(false);
                props.setChanged(true);
            })
            .catch(error => {
                props.setIsOpen(false);
                console.log(error);
            })
    };

    return (
        props.IsOpen === true ?
            <div className={styles.deleteContainer}>
                <div className={styles.deleteContent}>
                    <div className={styles.deleteHeader}>
                        <div className={styles.deleteTitle}>Eliminar</div>
                        <div className={styles.deleteClose} onClick={() => {props.setIsOpen(false);props.setCurrentNote("");props.setEditNote(false)}}>
                            <AiOutlineClose />
                        </div>
                    </div>
                    <div className={styles.deleteInfo}>
                        <div className={styles.deleteInfoText}>
                            <p>{props.text}</p>
                        </div>
                        <div className={styles.deleteInfoButtons}>
                            <button className={`${styles.deleteInfoBtn} ${styles.deleteBtn}`} onClick={() => DeleteNote()}>Eliminar</button>
                            <button className={`${styles.deleteInfoBtn} ${styles.cancelBtn}`} onClick={() => {props.setIsOpen(false);props.setCurrentNote("");props.setEditNote(false)}}>Cancelar</button>
                        </div>
                    </div>
                </div>
            </div>
            : null
    )
}

export default NotesDelete