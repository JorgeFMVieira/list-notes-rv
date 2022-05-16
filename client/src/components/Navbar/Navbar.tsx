import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './Navbar.module.css';
import { FaRegUserCircle } from 'react-icons/fa';
import { AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';
import { GetUser } from '../../models/Auth/GetUser';
import { AuthService } from '../../services/Auth/AuthService';
import { Get } from '../../models/Auth/Get';

const Navbar = () => {

    const { isUserLoggedIn, currentUser } = useAuth();
    const [currentLink, setCurrentLink] = useState("/");
    const [openProfile, setOpenProfile] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);
    const [fade, setFade] = useState(styles.fadeOut);
    const [user, setUser] = useState<GetUser>(new GetUser());
    const service: AuthService = new AuthService();

    const pathname = window.location.pathname;

    const clickOutside = (event: any) => {
        event.stopPropagation();
        if (profileRef && profileRef.current && profileRef.current.contains(event.target)) {
            setOpenProfile(!openProfile);
        } else {
            setFade(styles.fadeOut);
        }
    }

    const Logout = async () => {
        await service.Logout();
    }

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


    useEffect(() => {
        GetUserInfo();
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

    }, [currentLink, pathname, openProfile, currentUser]);

    return (
        <div className={styles.navbar}>
            <span className={styles.navLogo}>Notes RV</span>
            <div className={`${styles.navItems} ${isOpen && styles.open}`}>
                {currentUser !== null && isUserLoggedIn ?
                    <>
                        <Link to="/" className={`${styles.navlinkItem} ${currentLink === '/' ? styles.activeLink : ''}`} onClick={() => { setCurrentLink("/"); setIsOpen(!isOpen) }}>Notas</Link>
                        <div ref={profileRef} className={`${styles.navlinkItem} ${currentLink === '/logout' ? styles.activeLink : ''}${styles.navlinkProfile}`}>
                            <p className={styles.navbarItem}><FaRegUserCircle className={styles.userProfile} /></p>
                            <div className={`${styles.profile} ${fade}`} onClick={() => setIsOpen(!isOpen)}>
                                <div className={`${styles.profileItem} ${styles.profileInfo}`}>
                                    <p className={styles.profileLink}>{user.first_name} {user.last_name}</p>
                                </div>
                                <div className={`${styles.profileItem} ${styles.profileInfo} ${currentLink === '/profile' ? styles.activeLink : ''}`} onClick={() => setCurrentLink("/profile")}>
                                    <Link to="/profile" className={`${styles.profileLink} ${styles.profileOption}`}>Perfil</Link>
                                </div>
                                <div className={`${styles.profileItem} ${styles.profileInfo} ${currentLink === '/logout' ? styles.activeLink : ''}`} onClick={() => setCurrentLink("/logout")}>
                                    <p onClick={() => Logout()} className={`${styles.profileLink} ${styles.profileOption}`}>Terminar Sessão</p>
                                </div>
                            </div>
                        </div>
                    </>
                    :
                    <>
                        <Link to="/" className={`${styles.navlinkItem} ${currentLink === '/' ? styles.activeLink : ''}`} onClick={() => { setCurrentLink("/"); setIsOpen(!isOpen) }}>Iniciar Sessão</Link>
                        <Link to="/signup" className={`${styles.navlinkItem} ${currentLink === '/signup' ? styles.activeLink : ''}`} onClick={() => { setCurrentLink("/"); setIsOpen(!isOpen) }}>Registar</Link>
                    </>}

            </div>
            <div className={`${styles.navToggle} ${isOpen && styles.open}`} onClick={() => setIsOpen(!isOpen)}>
                <div className={styles.bar}></div>
            </div>
        </div>
    )
}

export default Navbar