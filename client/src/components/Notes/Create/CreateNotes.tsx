import React from 'react'
import styles from './CreateNotes.module.css'

const CreateNotes = (props: any) => {

    return (
        <div className={styles.createNote}>
            <button onClick={() => {props.createOpen === true ? props.setCreateOpen(false) : props.setCreateOpen(true); props.setEditNote(false)}}>Criar</button>
        </div>
    )
}

export default CreateNotes