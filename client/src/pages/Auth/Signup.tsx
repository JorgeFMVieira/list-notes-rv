import React, { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext';
import { AuthService } from '../../services/Auth/AuthService';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Auth.module.css';
import { AiFillEye, AiFillEyeInvisible, AiOutlineWarning } from 'react-icons/ai';
import { RegisterDTO } from '../../models/Auth/RegisterDTO';

const Login = () => {

    const service: AuthService = new AuthService();
    const { setCurrentUser, currentUser } = useAuth();
    const [user, setUser] = useState<RegisterDTO>(new RegisterDTO());
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);
    const [error, setError] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [field, setField] = useState("");
    const [cPassword, setCPassword] = useState("");

    const checkLoggedIn = async () => {
        if (currentUser !== null) {
            navigate("/");
        }
    }

    const Login = async () => {
        const SignUp: RegisterDTO = {
            ...user
        }
        service.Register(SignUp)
            .then((response: any) => {
                if(cPassword !== user.password){
                    setError(true);
                    setErrorMsg("As palavras-passes não coincidem");
                    setField("password");
                    return;
                }
                if (response.success === false) {
                    setError(true);
                    setErrorMsg(response.message);
                    setField(response.field);
                    return;
                }
                navigate("/");
            })
            .catch((err: any) => {
                setError(true);
                setErrorMsg(err);
            });
    }

    const handleChangeInputs = async () => {
        if (field === 'email' || field === 'password' || field === 'first_name' || field === 'last_name') {
            setError(false);
            setField("");
            setErrorMsg("");
        }
    }

    const handlePass = (e: string) => {
        setError(false);
        setField("");
        setErrorMsg("");
        if (e !== user.password) {
            setField("password");
            setError(true);
            setErrorMsg("As palavras-passes não coincidem");
        }
        setCPassword(e);
    }

    useEffect(() => {
        checkLoggedIn();
    }, []);


    return (
        <div className={styles.containerMX500}>
            <div className={styles.title}>Registar</div>
            <div className={styles.signInContainer}>
                <div className={styles.SignInItemContainer}>
                    <div className={`${styles.signInItem} ${styles.signInItemW100}`}>
                        <input type="text" style={{ border: field === 'first_name' ? '1px solid #FA6163' : '' }} autoComplete='off' name="first_name" placeholder="Nome" onChange={(e) => { setUser({ ...user, first_name: e.target.value }); handleChangeInputs() }} />
                    </div>
                    <div className={`${styles.signInItem} ${styles.signInItemW100}`}>
                        <input type="text" style={{ border: field === 'last_name' ? '1px solid #FA6163' : '' }} autoComplete='off' name="last_name" placeholder="Sobrenome" onChange={(e) => { setUser({ ...user, last_name: e.target.value }); handleChangeInputs() }} />
                    </div>
                </div>
                <div className={styles.signInItem}>
                    <input type="text" style={{ border: field === 'email' ? '1px solid #FA6163' : '' }} autoComplete='off' name="email" placeholder="Endereço de Email" onChange={(e) => { setUser({ ...user, email: e.target.value }); handleChangeInputs() }} />
                </div>
                <div className={styles.SignInItemContainer}>
                    <div className={`${styles.signInItem} ${styles.signInItemW100}`}>
                        <div className={styles.signInPassword}>
                            <input type={showPassword ? 'text' : 'password'} style={{ border: field === 'password' ? '1px solid #FA6163' : '' }} autoComplete='off' name="email" placeholder="Palavra-Passe" onChange={(e) => { setUser({ ...user, password: e.target.value }); handleChangeInputs() }} />
                            {showPassword ?
                                <AiFillEyeInvisible onClick={() => setShowPassword(!showPassword)} className={styles.signInItemPassword} />
                                : <AiFillEye onClick={() => setShowPassword(!showPassword)} className={styles.signInItemPassword} />}
                        </div>
                    </div>
                    <div className={`${styles.signInItem} ${styles.signInItemW100}`}>
                        <div className={styles.signInPassword}>
                            <input type={showPassword2 ? 'text' : 'password'} style={{ border: field === 'password' ? '1px solid #FA6163' : '' }} autoComplete='off' name="email" placeholder="Confirme a Senha" onChange={(e) => handlePass(e.target.value)} />
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
                </div>
                <div className={styles.signInItem}>
                    <button onClick={() => Login()} disabled={error}>Registar</button>
                </div>
                <div className={styles.signInItem}>
                    <Link to="/"><span>Já possui conta?</span>&nbsp;Inicie Sessão</Link>
                </div>
            </div>
        </div>
    )
}

export default Login