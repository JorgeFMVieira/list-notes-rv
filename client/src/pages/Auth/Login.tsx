import React, { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext';
import { LoginDTO } from '../../models/Auth/LoginDTO';
import { AuthService } from '../../services/Auth/AuthService';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Auth.module.css';
import { AiFillEye, AiFillEyeInvisible, AiOutlineWarning } from 'react-icons/ai';

const Login = () => {

    const service: AuthService = new AuthService();
    const { setCurrentUser, currentUser } = useAuth();
    const [user, setUser] = useState<LoginDTO>(new LoginDTO());
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [field, setField] = useState("");

    const Login = async () => {
        const Sign: LoginDTO = {
            ...user
        }
        service.Login(Sign)
            .then((response: any) => {
                if (response.success === false) {
                    setError(true);
                    setErrorMsg(response.message);
                    setField(response.field);
                    return;
                }
                setCurrentUser(response.user);
                window.location.reload();
            })
            .catch((err: any) => {
                console.log(err);
            });
    }

    const handleChangeEmail = async () => {
        if (field === 'email') {
            setField("");
            setError(false);
        }
    }

    const handleChangePassword = async () => {
        if (field === 'password') {
            setField("");
            setError(false);
        }
    }

    useEffect(() => {
        if(currentUser != null){
            navigate("/");
        }
    }, []);


    return (
        <div className={styles.container}>
            <div className={styles.title}>Iniciar Sessão</div>
            <div className={styles.signInContainer}>
                <div className={styles.signInItem}>
                    <input type="text" style={{ border: field === 'email' ? '1px solid #FA6163' : '' }} autoComplete='off' name="email" placeholder="Endereço de Email" onChange={(e) => { setUser({ ...user, email: e.target.value }); handleChangeEmail() }} />
                </div>
                <div className={styles.signInItem}>
                    <div className={styles.signInPassword}>
                        <input type={showPassword ? 'text' : 'password'} style={{ border: field === 'password' ? '1px solid #FA6163' : '' }} autoComplete='off' name="email" placeholder="Palavra-Passe" onChange={(e) => { setUser({ ...user, password: e.target.value }); handleChangePassword() }} />
                        {showPassword ?
                            <AiFillEyeInvisible onClick={() => setShowPassword(!showPassword)} className={styles.signInItemPassword} />
                            : <AiFillEye onClick={() => setShowPassword(!showPassword)} className={styles.signInItemPassword} />}
                    </div>
                </div>
                <div className={styles.signInItem}>
                    {error ?
                        <div className={styles.signInError}><AiOutlineWarning style={{ fontSize: '1.5em' }} />&nbsp;{errorMsg}</div>
                        : null}
                </div>
                <div className={styles.signInItem}>
                    <button onClick={() => Login()}>Iniciar Sessão</button>
                </div>
                <div className={styles.signInItem}>
                    <Link to="/signup"><span>Não possui conta?</span>&nbsp;Registe-se já</Link>
                </div>
                <div className={styles.signInItem}>
                    <Link to="/forgotPassword"><span>Esqueceu-se da palavra-passe?</span>&nbsp;Recupere já</Link>
                </div>
            </div>
        </div>
    )
}

export default Login