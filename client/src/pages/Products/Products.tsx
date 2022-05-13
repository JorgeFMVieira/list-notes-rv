import React from 'react'
import { useAuth } from '../../context/AuthContext';

const Products = () => {


    const { isUserLoggedIn, currentUser } = useAuth();

    return (
        <div>
            {currentUser?.token ? <h1>Bienvenido {currentUser.first_name}</h1> : <h1>No estas logueado</h1>}
        </div>
    )
}

export default Products