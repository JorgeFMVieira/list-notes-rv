import React from 'react'
import { AiOutlineClose, AiOutlineSearch } from 'react-icons/ai'
import styles from './NotesSearch.module.css';

const NotesSearch = (props: any) => {
    return (
        <div className={styles.notesListSearch}>
            <input type="text" value={props.search} placeholder="Pesquise..." onChange={(e) => props.setSearch(e.target.value)} className={styles.searchNotes} />
            {props.search !== "" ?
                <AiOutlineClose className={styles.notesListSearchIcon} onClick={() => props.setSearch("")} />
                : <AiOutlineSearch className={styles.notesListSearchIcon} />
            }
        </div>
    )
}

export default NotesSearch