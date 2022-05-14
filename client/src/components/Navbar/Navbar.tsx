import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './Navbar.module.css';
import { FaRegUserCircle } from 'react-icons/fa';

const Navbar = () => {

    const { isUserLoggedIn, currentUser } = useAuth();
    const [currentLink, setCurrentLink] = useState("/");
    const [openProfile, setOpenProfile] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);
    const [fade, setFade] = useState(styles.fadeOut);

    const pathname = window.location.pathname;

    const clickOutside = (event: any) => {
        event.stopPropagation();
        if (profileRef && profileRef.current && profileRef.current.contains(event.target)) {
            setOpenProfile(!openProfile);
        } else {
            setFade(styles.fadeOut);
        }
    }

    useEffect(() => {
        setCurrentLink(pathname);

        if (openProfile === true) {
            setFade(styles.fadeIn);
        } else {
            setFade(styles.fadeOut);
        }

        document.addEventListener("click", clickOutside);

        return () => {
            document.removeEventListener("click", clickOutside);
        }

    }, [currentLink, pathname, openProfile]);

    return (
        <div className={styles.navbar}>
            <div className={styles.logo}>
                <Link to="/">Notes RV</Link>
            </div>
            <div className={styles.navlinks}>
                {currentUser !== null && isUserLoggedIn ?
                    <>
                        <div className={`${styles.navlink} ${currentLink === '/' ? styles.activeLink : ''}`} onClick={() => setCurrentLink("/")}>
                            <Link to="/" className={styles.navbarItem}>Notas</Link>
                        </div>
                        <div ref={profileRef} className={`${styles.navlink} ${currentLink === '/logout' ? styles.activeLink : ''}${styles.navlinkProfile}`}>
                            <p className={styles.navbarItem}><FaRegUserCircle className={styles.userProfile} /></p>
                            <div className={`${styles.profile} ${fade}`}>
                                <div className={`${styles.profileItem} ${styles.profileInfo}`}>
                                    <p className={styles.profileLink}>{currentUser.first_name} {currentUser.last_name}</p>
                                </div>
                                <div className={`${styles.profileItem} ${styles.profileInfo}`}>
                                    <Link to="/profile" className={`${styles.profileLink} ${styles.profileOption}`}>Perfil</Link>
                                </div>
                                <div className={`${styles.profileItem} ${styles.profileInfo}`}>
                                    <Link to="/logout" className={`${styles.profileLink} ${styles.profileOption}`}>Termisar Sessão</Link>
                                </div>
                            </div>
                        </div>
                    </>
                    :
                    <>
                        <div className={`${styles.navlink} ${currentLink === '/' ? styles.activeLink : ''}`} onClick={() => setCurrentLink("/")}>
                            <Link to="/" className={styles.navbarItem}>Iniciar Sessão</Link>
                        </div>
                        <div className={`${styles.navlink} ${currentLink === '/signup' ? styles.activeLink : ''}`} onClick={() => setCurrentLink("/signup")}>
                            <Link to="/signup" className={styles.navbarItem}>Registar</Link>
                        </div>
                    </>
                }
            </div>
        </div>
    )
}

export default Navbar