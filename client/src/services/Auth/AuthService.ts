import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { MessagingHelper } from "../../helpers/MessagingHelper";
import { AuthDTO } from "../../models/Auth/AuthDTO";
import { CurrentPassword } from "../../models/Auth/CurrentPassword";
import { ForgotPasswordDTO } from "../../models/Auth/ForgotPasswordDTO";
import { GetUser } from "../../models/Auth/GetUser";
import { LoginDTO } from "../../models/Auth/LoginDTO";
import { RecoverPasswordDTO } from "../../models/Auth/RecoverPasswordDTO";
import { RegisterDTO } from "../../models/Auth/RegisterDTO";
import { UpdateUser } from "../../models/Auth/UpdateUser";
import Api from "../../providers/Api";
import { APIService } from "../APIService";


export class AuthService {

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

    GetUserInfo = async (data: any) : Promise<MessagingHelper<GetUser>> => {
        const response = await Api.post("/GetUser", {...data});
        return response.data;
    }

    UpdateUserInfo = async (data: any) : Promise<MessagingHelper<UpdateUser>> => {
        const response = await Api.post("/updateUser", {...data});
        return response.data;
    }

    ChangeCurrentPassword = async (data: CurrentPassword) : Promise<MessagingHelper<CurrentPassword>> => {
        const response = await Api.post("/changeCurrentPassword", {...data});
        return response.data;
    }

    Logout = () => {
        localStorage.removeItem("user");
        window.location.replace("/");
    };
}