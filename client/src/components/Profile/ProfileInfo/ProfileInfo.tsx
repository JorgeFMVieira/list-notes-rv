import React from 'react'
import styles from './ProfileInfo.module.css'

const ProfileInfo = () => {
    return (
        <div className={styles.profileInfo}>
            <div className={styles.profileTitle}>
                <span>Perfil</span>
            </div>
            <div className={styles.profileContent}>
              <div className={styles.profileItemDouble}>
                  <div className={styles.profileItem}>
                      <label htmlFor="first_name">Primeiro Nome</label>
                      <input type="text" name='first_name' id='first_name' placeholder='Primeiro Nome' autoComplete='off' />
                  </div>
                  <div className={styles.profileItem}>
                      <label htmlFor="last_name">Último Nome</label>
                      <input type="text" name='last_name' id='last_name' placeholder='Último Nome' autoComplete='off' />
                  </div>
              </div>
              <div className={styles.profileItem}>
                  <label htmlFor="email">Email</label>
                  <input type="text" name='email' id='email' placeholder='Endereço de Email' autoComplete='off' />
              </div>
            </div>
        </div>
    )
}

export default ProfileInfo