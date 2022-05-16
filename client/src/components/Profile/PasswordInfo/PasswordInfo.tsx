import React, { useEffect, useState } from 'react'
import styles from '../Info.module.css'
import { AiFillEye, AiOutlineCheck, AiOutlineEyeInvisible, AiOutlineWarning } from 'react-icons/ai'
import { AuthService } from '../../../services/Auth/AuthService';
import { CurrentPassword } from '../../../models/Auth/CurrentPassword';
import { UpdateUser } from '../../../models/Auth/UpdateUser';
import { GetUser } from '../../../models/Auth/GetUser';
import { Get } from '../../../models/Auth/Get';
import { useAuth } from '../../../context/AuthContext';

const PasswordInfo = () => {

    const { isUserLoggedIn, currentUser } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);
    const [showPassword3, setShowPassword3] = useState(false);
    const [passwordInfo, setPasswordInfo] = useState<CurrentPassword>(new CurrentPassword());
    const [error, setError] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [success, setSuccess] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");
    const [user, setUser] = useState<GetUser>(new GetUser());

    const service: AuthService = new AuthService();

    const ChangePassword = async () => {
        var data: CurrentPassword = {
            ...passwordInfo,
        }
        await service.ChangeCurrentPassword(data)
            .then(response => {
                if (response.success === false) {
                    setError(true);
                    setErrorMsg(response.message);
                    return;
                }

                if (response.success === true) {
                    // Clear all input fields
                    setPasswordInfo({ ...passwordInfo, currentPassword: "", password: "", confirmPassword: "" });
                    setSuccess(true);
                    setSuccessMsg(response.message);
                    setTimeout(() => {
                        setSuccess(false);
                    }, 3500);
                }
            })
            .catch(err => {
                setError(true);
                setErrorMsg(err);
            });
    }

    useEffect(() => {
        var data: Get = {
            token: currentUser?.token
        }
        service.GetUserInfo(data)
            .then(response => {
                setUser(response.obj);
            })
            .catch(err => {
                setError(true);
                setErrorMsg(err);
            });
        setPasswordInfo({ ...passwordInfo, id: user.id });
    }, [currentUser, user]);

    return (
        <div className={styles.profileContainer}>
            <div className={styles.profileTitle}>Alterar Palavra-Passe</div>
            <div className={styles.profileItem}>
                <label htmlFor="currentPassword">Palavra-Passe Atual</label>
                <div className={styles.passwordContainer}>
                    <input type={`${showPassword3 ? 'text' : 'password'}`} value={passwordInfo.currentPassword} name='currentPassword' id='currentPassword' placeholder='Palavra-Passe Atual' onChange={(e) => { setPasswordInfo({ ...passwordInfo, currentPassword: e.target.value }); setError(false) }} />
                    <div className={styles.passwordIcon} onClick={() => setShowPassword3(!showPassword3)}>
                        {showPassword3 ? <AiOutlineEyeInvisible /> : <AiFillEye />}
                    </div>
                </div>
            </div>
            <div className={styles.profileItemDouble}>
                <div className={styles.profileItem}>
                    <label htmlFor="newPassword">Nova Palavra-Passe</label>
                    <div className={styles.passwordContainer}>
                        <input type={`${showPassword ? 'text' : 'password'}`} value={passwordInfo.password} name='newPassword' id='newPassword' placeholder='Nova Palavra-Passe' onChange={(e) => { setPasswordInfo({ ...passwordInfo, password: e.target.value }); setError(false) }} />
                        <div className={styles.passwordIcon} onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <AiOutlineEyeInvisible /> : <AiFillEye />}
                        </div>
                    </div>
                </div>
                <div className={styles.profileItem}>
                    <label htmlFor="newPassword2">Confirme a Palavra-Passe</label>
                    <div className={styles.passwordContainer}>
                        <input type={`${showPassword2 ? 'text' : 'password'}`} value={passwordInfo.confirmPassword} name='newPassword2' id='newPassword2' placeholder='Confirme a Palavra-Passe' onChange={(e) => { setPasswordInfo({ ...passwordInfo, confirmPassword: e.target.value }); setError(false) }} />
                        <div className={styles.passwordIcon} onClick={() => setShowPassword2(!showPassword2)}>
                            {showPassword2 ? <AiOutlineEyeInvisible /> : <AiFillEye />}
                        </div>
                    </div>
                </div>
            </div>
            {error ?
                <div className={styles.profileItem}>
                    <div className={styles.profileError}><AiOutlineWarning style={{ fontSize: '1.5em' }} />&nbsp;{errorMsg}</div>
                </div>
                : null}
            {success ?
                <div className={styles.profileItem}>
                    <div className={styles.profileSuccess}><AiOutlineCheck style={{ fontSize: '1.5em' }} />&nbsp;{successMsg}</div>
                </div>
                : null}
            <div className={styles.profileItem}>
                <button onClick={() => ChangePassword()}>Guardar</button>
            </div>
        </div>
    )
}

export default PasswordInfo