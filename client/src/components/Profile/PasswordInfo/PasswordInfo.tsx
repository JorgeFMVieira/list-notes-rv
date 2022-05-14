import React, { useState } from 'react'
import styles from './PasswordInfo.module.css'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'

const PasswordInfo = () => {

    const [showPassword, setShowPassword] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);


    return (
        <div className={styles.profileInfo}>
            <div className={styles.profileTitle}>
                <span>Alterar Palavra-Passe</span>
            </div>
            <div className={styles.profileContent}>
              <div className={styles.profileItem}>
                  <label htmlFor="currentPassword">Palavra-Passe Atual</label>
                  <div className={`${styles.passwordContainer} ${styles.defaultInput}`}>
                      <input type="text" name='currentPassword' id='currentPassword' placeholder='Palavra-Passe Atual' autoComplete='off' />
                  </div>
              </div>
              <div className={styles.profileItemDouble}>
                  <div className={styles.profileItem}>
                      <label htmlFor="password">Nova Palavra-Passe</label>
                      <div className={styles.passwordContainer}>
                          <input type={`${showPassword ? 'text' : 'password'}`} name='password' id='password' placeholder='Nova Palavra-Passe' autoComplete='off' />
                          {showPassword ? <AiOutlineEyeInvisible onClick={() => setShowPassword(!showPassword)} className={styles.iconPassword} /> : <AiOutlineEye onClick={() => setShowPassword(!showPassword)} className={styles.iconPassword} />}
                      </div>
                  </div>
                  <div className={styles.profileItem}>
                      <label htmlFor="last_name">Confirmar Nova Palavra-Passe</label>
                      <div className={styles.passwordContainer}>
                          <input type={`${showPassword2 ? 'text' : 'password'}`} name='last_name' id='last_name' placeholder='Confirmar Nova Palavra-Passe' autoComplete='off' />
                          {showPassword2 ? <AiOutlineEyeInvisible className={styles.iconPassword} onClick={() => setShowPassword2(!showPassword2)} /> : <AiOutlineEye className={styles.iconPassword} onClick={() => setShowPassword2(!showPassword2)} />}
                      </div>
                  </div>
              </div>
            </div>
        </div>
    )
}

export default PasswordInfo