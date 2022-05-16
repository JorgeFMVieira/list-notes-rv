import React, { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext';
import { Get } from '../../models/Auth/Get';
import { GetUser } from '../../models/Auth/GetUser';
import { AuthService } from '../../services/Auth/AuthService';

const Products = () => {


    const { isUserLoggedIn, currentUser } = useAuth();
    const [user, setUser] = useState<GetUser>(new GetUser());

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

    useEffect(() => {
        GetUserInfo();
    }, [currentUser]);

    return (
        <div>
            {user.email}
        </div>
    )
}

export default Products