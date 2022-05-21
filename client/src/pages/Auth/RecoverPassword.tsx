import React, { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext';
import { AuthService } from '../../services/Auth/AuthService';
import { Link, useNavigate, useParams } from 'react-router-dom';
import styles from './Auth.module.css';
import { AiFillCheckCircle, AiFillEye, AiFillEyeInvisible, AiOutlineWarning } from 'react-icons/ai';
import { RecoverPasswordDTO } from '../../models/Auth/RecoverPasswordDTO';

const RecoverPassword = () => {

    const { token } = useParams();
    const service: AuthService = new AuthService();
    const { setCurrentUser, currentUser } = useAuth();
    const [pass2, setPass2] = useState('');
    const [recover, setRecover] = useState<RecoverPasswordDTO>(new RecoverPasswordDTO());
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);
    const [error, setError] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [success, setSuccess] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");
    const [field, setField] = useState("");

    const RecoverPassword = async () => {
        const Sign: RecoverPasswordDTO = {
            token: token!,
            password: recover.password
        }
        service.RecoverPassword(Sign)
            .then((response: any) => {
                if(response.tokenValid === false){
                    navigate("/");
                }
                if(recover.password != pass2){
                    setSuccess(false);
                    setError(true);
                    setErrorMsg("As palavras-passe não coincidem");
                    setField("password");
                    return;
                }
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
                    }, 3500);
                }
            })
            .catch(err => {
                setError(true);
                setErrorMsg(err);
                setField("all");
            })
    }

    const handleInput = async () => {
        setField("");
        setError(false);
    }

    const handleChangePassword = async (e: string) => {
        setField("");
        setError(false);
        if(e !== recover.password){
            setError(true);
            setErrorMsg("As palavras-passes não coincidem");
            setField("password");
        }
        setPass2(e);
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
        if(token === null){
            navigate("/");
        }
    }, []);


    return (
        <div className={styles.container}>
            <div className={styles.title}>Repor Palavra-Passe</div>
            <div className={styles.signInContainer}>
            <div className={styles.SignInItemContainer}>
                    <div className={`${styles.signInItem} ${styles.signInItemW100}`}>
                        <div className={styles.signInPassword}>
                            <input onKeyPress={(e) => handleKeyPress(e)} type={showPassword ? 'text' : 'password'} style={{ border: field === 'password' ? '1px solid #FA6163' : '' }} autoComplete='off' name="email" placeholder="Palavra-Passe" onChange={(e) => {setRecover({ ...recover, password: e.target.value });handleInput()}} />
                            {showPassword ?
                                <AiFillEyeInvisible onClick={() => setShowPassword(!showPassword)} className={styles.signInItemPassword} />
                                : <AiFillEye onClick={() => setShowPassword(!showPassword)} className={styles.signInItemPassword} />}
                        </div>
                    </div>
                    <div className={`${styles.signInItem} ${styles.signInItemW100}`}>
                        <div className={styles.signInPassword}>
                            <input onKeyPress={(e) => handleKeyPress(e)} type={showPassword2 ? 'text' : 'password'} style={{ border: field === 'password' ? '1px solid #FA6163' : '' }} autoComplete='off' name="email" placeholder="Confirme a Senha" onChange={(e) => handleChangePassword(e.target.value)} />
                            {showPassword2 ?
                                <AiFillEyeInvisible onClick={() => setShowPassword2(!showPassword2)} className={styles.signInItemPassword} />
                                : <AiFillEye onClick={() => setShowPassword2(!showPassword2)} className={styles.signInItemPassword} />}
                        </div>
                    </div>
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
                    <button onClick={() => RecoverPassword()}>Confirmar</button>
                </div>
                <div className={styles.signInItem}>
                    <Link to="/"><span>Mudou de ideias?</span>&nbsp;Inicie Sessão</Link>
                </div>
            </div>
        </div>
    )
}

export default RecoverPassword