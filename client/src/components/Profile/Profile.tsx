import React, { useState } from 'react'
import PasswordInfo from './PasswordInfo/PasswordInfo';
import styles from './Profile.module.css'
import ProfileInfo from './ProfileInfo/ProfileInfo';

const Profile = () => {

    const [showProfile, setShowProfile] = useState(true);
    const [showPass, setShowPass] = useState(false);

    return (
        <div className={styles.profile}>
            <div className={styles.profileButtons}>
                <button className={`${showProfile ? styles.active : styles.btnDisabled}`} onClick={() => {setShowProfile(true);setShowPass(false)}}>Perfil</button>
                <button className={`${showPass ? styles.active : styles.btnDisabled}`} onClick={() => {setShowProfile(false);setShowPass(true)}}>Palavra-Passe</button>
            </div>
            <div className={styles.profileInfo}>
                {showProfile ? <ProfileInfo /> : <PasswordInfo />}
            </div>
        </div>
    )
}

export default Profile