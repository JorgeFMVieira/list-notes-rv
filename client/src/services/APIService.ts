import axios, { AxiosInstance } from "axios";
import { AuthService } from "./Auth/AuthService";

class APIServiceClass {
    private url: string  = process.env.REACT_APP_BACKEND_URL as string;
    private token: string | null = null;
    private instance = axios.create();
    private authService = new AuthService();

    constructor(){
        var service = this.authService;
        this.instance.interceptors.response.use(function (response){
            return response
        }, function(error){
            if(error.response.status === 401){
                service.Logout();
                window.location.href = "/";
            }
            return Promise.reject(error);
        })
    }

    GetURL(): string{
        return this.url
    }

    SetToken(token: string | null){
        this.token = token;
    }

    GetToken(): string{
        return this.token?? "";
    }

    Axios(): AxiosInstance{
        return this.instance;
    }
}

export const APIService = new APIServiceClass();