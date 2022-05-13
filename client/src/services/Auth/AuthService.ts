import { useAuth } from "../../context/AuthContext";
import { MessagingHelper } from "../../helpers/MessagingHelper";
import { AuthDTO } from "../../models/Auth/AuthDTO";
import { ForgotPasswordDTO } from "../../models/Auth/ForgotPasswordDTO";
import { LoginDTO } from "../../models/Auth/LoginDTO";
import { RecoverPasswordDTO } from "../../models/Auth/RecoverPasswordDTO";
import { RegisterDTO } from "../../models/Auth/RegisterDTO";
import Api from "../../providers/Api";
import { APIService } from "../APIService";


export class AuthService {
    Logout() {
        throw new Error("Method not implemented.");
    }
    Login = async (data: any): Promise<MessagingHelper<LoginDTO>> => {
        const response = await Api.post("/login", { ...data },{
            withCredentials: true
        });
        return response.data;
    }

    Register = async (data: any): Promise<MessagingHelper<RegisterDTO>> => {
        const response = await Api.post("/register", { ...data });
        return response.data;
    }

    ForgotPassword = async (data: ForgotPasswordDTO): Promise<MessagingHelper<ForgotPasswordDTO>> => {
        const response = await Api.post("/ForgotPassword", {...data});
        return response.data;
    }

    RecoverPassword = async (data: RecoverPasswordDTO): Promise<MessagingHelper<RecoverPasswordDTO>> => {
        const password = data.password;
        const response = await Api.post("/ResetPassword?token=" + data.token, {password});
        return response.data;
    }
}