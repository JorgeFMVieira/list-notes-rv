import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './Navbar.module.css';
import { FaRegUserCircle } from 'react-icons/fa';

const Navbar = () => {

    const { isUserLoggedIn, currentUser } = useAuth();
    const [currentLink, setCurrentLink] = useState("/");

    const pathname = window.location.pathname;

    useEffect(() => {
        setCurrentLink(pathname);
    }, [currentLink, pathname]);

    return (
        <div className={styles.navbar}>
            <div className={styles.logo}>Notes RV</div>
            <div className={styles.navlinks}>
                {currentUser !== null && isUserLoggedIn ?
                    <>
                        <div className={`${styles.navlink} ${currentLink === '/' ? styles.activeLink : ''}`} onClick={() => setCurrentLink("/")}>
                            <Link to="/">Notas</Link>
                        </div>
                        <div className={`${styles.navlink} ${currentLink === '/logout' ? styles.activeLink : ''}`} onClick={() => setCurrentLink("/logout")}>
                            <Link to="/"><FaRegUserCircle className={styles.userProfile} /></Link>
                        </div>
                    </>
                    :
                    <>
                        <div className={`${styles.navlink} ${currentLink === '/' ? styles.activeLink : ''}`} onClick={() => setCurrentLink("/")}>
                            <Link to="/">Iniciar Sessão</Link>
                        </div>
                        <div className={`${styles.navlink} ${currentLink === '/signup' ? styles.activeLink : ''}`} onClick={() => setCurrentLink("/signup")}>
                            <Link to="/signup">Registar</Link>
                        </div>
                    </>
                }
            </div>
        </div>
    )
}

export default Navbar