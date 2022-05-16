import React, { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext';
import { AuthService } from '../../services/Auth/AuthService';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Auth.module.css';
import { AiFillCheckCircle, AiOutlineWarning } from 'react-icons/ai';
import { ForgotPasswordDTO } from '../../models/Auth/ForgotPasswordDTO';

const ForgotPassword = () => {

    const service: AuthService = new AuthService();
    const { currentUser } = useAuth();
    const [user, setUser] = useState<ForgotPasswordDTO>(new ForgotPasswordDTO());
    const navigate = useNavigate();
    const [error, setError] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [success, setSuccess] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");
    const [field, setField] = useState("");

    const RecoverPassword = async () => {
        const Sign: ForgotPasswordDTO = {
            ...user
        }
        service.ForgotPassword(Sign)
            .then((response: any) => {
                console.log(response);
                if (response.success === false) {
                    setSuccess(false);
                    setError(true);
                    setErrorMsg(response.message);
                    setField(response.field);
                    return;
                } else {
                    setError(false);
                    setSuccess(true);
                    setSuccessMsg(response.message);
                    setTimeout(() => {
                        navigate("/");
                    }, 6000);
                }
            })
            .catch(err => {
                setError(true);
                setErrorMsg(err);
                setField("all");
            })
    }

    const handleChangeEmail = async () => {
        setField("");
        setError(false);
    }

    const handleKeyPress = async (e: any) => {
        if(e.key === 'Enter'){
            RecoverPassword();
        }
    }

    useEffect(() => {
        if (currentUser != null) {
            navigate("/");
        }
    }, []);


    return (
        <div className={styles.container}>
            <div className={styles.title}>Repor Palavra-Passe</div>
            <div className={styles.signInContainer}>
                <div className={styles.signInItem}>
                    <input onKeyPress={(e) => handleKeyPress(e)} type="text" style={{ border: field === 'email' ? '1px solid #FA6163' : '' }} autoComplete='off' name="email" placeholder="Endereço de Email" onChange={(e) => { setUser({ ...user, email: e.target.value }); handleChangeEmail() }} />
                </div>
                <div className={styles.signInItem}>
                    {error ?
                        <div className={styles.signInError}><AiOutlineWarning style={{ fontSize: '1.5em' }} />&nbsp;{errorMsg}</div>
                        : null}
                    {success ?
                        <div className={styles.signInSuccess}><AiFillCheckCircle style={{ fontSize: '1.5em' }} />&nbsp;{successMsg}</div>
                        : null}
                </div>
                <div className={styles.signInItem}>
                    <button onClick={() => RecoverPassword()}>Recuperar</button>
                </div>
                <div className={styles.signInItem}>
                    <Link to="/"><span>Mudou de ideias?</span>&nbsp;Inicie Sessão</Link>
                </div>
            </div>
        </div>
    )
}

export default ForgotPassword