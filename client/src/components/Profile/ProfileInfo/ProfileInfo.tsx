import React, { useEffect, useState } from 'react'
import { AiOutlineWarning, AiOutlineCheck } from 'react-icons/ai';
import { useAuth } from '../../../context/AuthContext';
import { Get } from '../../../models/Auth/Get';
import { GetUser } from '../../../models/Auth/GetUser';
import { UpdateUser } from '../../../models/Auth/UpdateUser';
import { AuthService } from '../../../services/Auth/AuthService';
import styles from '../Info.module.css'

const ProfileInfo = () => {

    const { isUserLoggedIn, currentUser } = useAuth();
    const [user, setUser] = useState<GetUser>(new GetUser());
    const [error, setError] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [field, setField] = useState("");
    const [success, setSuccess] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");

    const service: AuthService = new AuthService();

    const GetUserInfo = async () => {
        var data: Get = {
            token: currentUser?.token
        }
        await service.GetUserInfo(data)
            .then(response => {
                setUser(response.obj);
            })
            .catch(err => {
                console.log(err);
            });
    }

    const UpdateUser = async () => {
        var data: UpdateUser = {
            ...user
        }
        await service.UpdateUserInfo(data)
            .then((response: any) => {
                if (response.success === false) {
                    setError(true);
                    setErrorMsg(response.message);
                    setField(response.field);
                    return;
                }

                if (response.success === true) {
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
        GetUserInfo();
    }, [currentUser]);

    return (
        <div className={styles.profileContainer}>
            <div className={styles.profileTitle}>Perfil</div>
            <div className={styles.profileItemDouble}>
                <div className={styles.profileItem}>
                    <label htmlFor="first_name">Primeiro Nome</label>
                    <input type="text" name='first_name' id='first_name' placeholder='Primeiro Nome' defaultValue={user.first_name} onChange={(e) => { setUser({ ...user, first_name: e.target.value }); setError(false) }} />
                </div>
                <div className={styles.profileItem}>
                    <label htmlFor="last_name">Último Nome</label>
                    <input type="text" name='last_name' id='last_name' placeholder='Último Nome' defaultValue={user.last_name} onChange={(e) => { setUser({ ...user, last_name: e.target.value }); setError(false) }} />
                </div>
            </div>
            <div className={styles.profileItem}>
                <label htmlFor="email">Email</label>
                <input type="text" name='email' id='email' placeholder='Email' defaultValue={user.email} onChange={(e) => { setUser({ ...user, email: e.target.value }); setError(false) }} />
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
                <button onClick={() => UpdateUser()}>Guardar</button>
            </div>
        </div>
    )
}

export default ProfileInfo