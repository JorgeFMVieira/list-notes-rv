import User from "../../Models/Users/User";
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import validator from 'email-validator';
import sgMail from "../../Config/Email/EmailConfig";
import jwtSimple from "jwt-simple";

dotenv.config();

const Register = async (req: any, res: any) => {
    try {
        const { first_name, last_name, email, password } = req.body;

        if (!first_name) {
            return res.json({
                success: false,
                message: "Preencha o campo do nome",
                field: 'first_name'
            });
        }
        if (!last_name) {
            return res.json({
                success: false,
                message: "Preencha o campo do sobrenome",
                field: 'last_name'
            });
        }
        if (!email) {
            return res.json({
                success: false,
                message: "Preencha o campo do email",
                field: 'email'
            });
        }
        if (!password) {
            return res.json({
                success: false,
                message: "Preencha o campo da palavra-passe",
                field: 'password'
            });
        }

        if (!validator.validate(email)) {
            return res.json({
                success: false,
                message: "Introduza um endereço de email válido",
                field: 'email'
            });
        }

        const oldUser = await User.findOne({ email });

        if (oldUser) {
            return res.json({
                success: false,
                message: "Parece que esse email já está em uso.",
                field: "email"
            });
        }

        const encryptedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            first_name,
            last_name,
            email: email.toLowerCase(),
            password: encryptedPassword,
        });

        const token = jwt.sign(
            { user_id: user._id, email },
            `${process.env.TOKEN_KEY}`,
            {
                expiresIn: "2h",
            }
        );

        user.token = token;

        return res.json({
            user,
        });
    } catch (err) {
        return res.json({
            status: 400,
            message: err,
            field: "all"
        });
    }
}


const UserLogin = async function (req: any, res: any, next: any) {
    try {
        const { email, password } = req.body;

        if (!email) {
            return res.json({
                success: false,
                message: "Preencha o campo do email.",
                field: 'email'
            });
        } else if (!password && email) {
            return res.json({
                success: false,
                message: "Preencha o campo da palavra passe.",
                field: 'password'
            });
        }

        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            const token = jwt.sign(
                { user_id: user._id, email },
                `${process.env.TOKEN_KEY}`,
                {
                    expiresIn: "2h",
                }
            );

            user.token = token;

            return res.json({
                user: {
                    token: user.token,
                }
            });
        }

        if (!user) {
            return res.json({
                success: false,
                message: "Email não encontrado.",
                field: 'email'
            });
        }

        if (!(await bcrypt.compare(password, user.password))) {
            return res.json({
                success: false,
                message: "Palavra-Passe incorreta.",
                field: 'password'
            });
        }

        return res.json({
            success: false,
            message: "Algo inesperado aconteceu, contacte um admnistrador.",
            field: 'all'
        });

    } catch (e: any) {
        return res.json({ status: 400, message: e.message });
    }
}

const ForgotPassword = async (req: any, res: any) => {
    const { email } = req.body;

    if (email === "") {
        return res.json({
            success: false,
            message: "Preencha o campo do email.",
            field: "email"
        });
    }

    if (!validator.validate(email)) {
        return res.json({
            success: false,
            message: "Introduza um endereço de email válido",
            field: "email"
        });
    }

    const user = await User.findOne({ email: email });

    if (user) {
        const expires = new Date(Date.now() + 120 * 60000);
        expires.setTime(expires.getTime() + expires.getTimezoneOffset() * 60000);
        const dateExpired = expires.getTime();

        var payload = { user: user._id, date: dateExpired };
        var secret = process.env.TOKEN_KEY as string;
        var token = jwtSimple.encode(payload, secret);

        var url = process.env.FRONTEND_URL + '/recoverPassword/' + token;

        const msg = {
            to: email, // Change to your recipient
            from: 'jorgevieiratestes@gmail.com', // Change to your verified sender
            subject: 'Sending with SendGrid is Fun',
            text: `Notes RV\nRecebemos um pedido para repor a sua palavra-passe.\nClique no botão em baixo para repor a palavra-passe.\nRecuperar (${url})\n\nSe não foi você que efetuou este pedido, contate a equipa de administração o mais depressa possível, para mantermos a sua conta segura.\n\n♥ POWERED BY JORGE VIEIRA`,
            html: `Notes RV\nRecebemos um pedido para repor a sua palavra-passe.\nClique no botão em baixo para repor a palavra-passe.\nRecuperar (${url})\n\nSe não foi você que efetuou este pedido, contate a equipa de administração o mais depressa possível, para mantermos a sua conta segura.\n\n♥ POWERED BY JORGE VIEIRA`,
            templateId: 'd-af4966927e374e6ba9648fdf98840ea1',
            dynamic_template_data: {
                url: url
            },
        }
        sgMail
            .send(msg)
            .then(() => {
                res.send({
                    success: true,
                    message: "Foi enviado um email com as instruções para repor a sua palavra-passe.",
                    field: "all"
                });
            })
            .catch(() => {
                res.json({
                    success: false,
                    message: "Serviço indisponível, tente mais tarde.",
                    field: "all",
                    user: user
                });
            });
    } else {
        return res.json({
            success: false,
            message: "Não encontramos esse email.",
            field: "all",
            user: user
        });
    }
}

const ResetPassword = async (req: any, res: any) => {
    const token = req.query.token;
    const { password } = req.body;

    jwt.verify(token, `${process.env.TOKEN_KEY}`, function(err: any, decoded: any) {
        if (err) {
            return res.json({
                tokenValid: false,
                success: false,
                message: "Acesso expirado.",
                field: "all"
            });
        }
    });

    const tokenDecoded = jwtSimple.decode(token, process.env.TOKEN_KEY as string);

    const date = new Date().getTime();

    const expires = tokenDecoded.date;

    if (date > expires) {
        return res.json({
            tokenValid: false,
            success: false,
            message: "Algo inesperado aconteceu. Tente novamente.",
        });
    }

    if (tokenDecoded === null) {
        return res.json({
            tokenValid: false,
            success: false,
            message: "Serviço indisponível, tente mais tarde.",
        });
    }

    if (password === "") {
        return res.json({
            success: false,
            message: "Preencha o campo da palavra-passe.",
        });
    }

    const user = tokenDecoded._id;

    const findUser = await User.findOne({ user });

    if (findUser === null) {
        return res.json({
            success: false,
            message: "Serviço indisponível, tente mais tarde.",
        });
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    const update = await User.findByIdAndUpdate({ _id: tokenDecoded.user }, { password: encryptedPassword });

    if (update === null) {
        return res.json({
            success: false,
            message: "Serviço indisponível, tente mais tarde.",
        });
    }

    return res.json({
        success: true,
        message: "Palavra-passe alterada com sucesso.",
    });
}

const GetUser = async (req: any, res: any) => {
    const { token } = req.body;

    if(token === ""){
        return res.json({
            success: false,
            message: "Preencha o campo do id.",
            field: "id"
        });
    }

    try{
        const tokenDecoded = jwtSimple.decode(token, process.env.TOKEN_KEY as string);

        if(tokenDecoded){
            const getUser = await User.findOne({ _id: tokenDecoded.user_id });
            if(getUser){
                return res.json({
                    success: true,
                    obj: {
                        id: getUser._id,
                        first_name: getUser.first_name,
                        last_name: getUser.last_name,
                        email: getUser.email,
                        token: token,
                    }
                });
            }else{
                return res.json({
                    success: false,
                    message: "Não conseguimos realizar essa operação.",
                });
            }
        }else{
            return res.json({
                success: false,
                message: "Algo inesperado aconteceu. Tente novamente.",
                field: "all"
            });
        }
    }
    catch(e){
        res.json({
            success: false,
            message: e
        });
    }
}

const UpdateUser = async (req: any, res: any) => {
    const { id, email, first_name, last_name } = req.body;

    if(id === ""){
        return res.json({
            success: false,
            message: "Algo inesperado aconteceu.",
        });
    }

    if(email === ""){
        return res.json({
            success: false,
            message: "Preencha o campo do email.",
            field: "email"
        });
    }

    if(first_name === ""){
        return res.json({
            success: false,
            message: "Preencha o campo do nome.",
            field: "first_name"
        });
    }

    if(last_name === ""){
        return res.json({
            success: false,
            message: "Preencha o campo do sobrenome.",
            field: "last_name"
        });
    }

    if (!validator.validate(email)) {
        return res.json({
            success: false,
            message: "Introduza um endereço de email válido",
            field: 'email'
        });
    }

    const currentUser = await User.findById({ _id: id });

    if(currentUser === null){
        return res.json({
            success: false,
            message: "Algo inesperado aconteceu.",
        });
    }

    const checkEmail = await User.findOne({ email });

    if(checkEmail.email !== currentUser.email){
        if (checkEmail) {
            return res.json({
                success: false,
                message: "Parece que esse email já está em uso.",
                field: "email"
            });
        }
    }

    const update = await User.findByIdAndUpdate(
        { _id: id }, 
        { 
            first_name: first_name, 
            last_name: last_name,
            email: email
        }
    );

    if(update === null){
        return res.json({
            success: false,
            message: "Não conseguimos realizar essa operação.",
        });
    }

    return res.json({
        success: true,
        message: "Os seus dados foram atualizados com sucesso.",
    });
}

const ChangeCurrentPassword = async (req: any, res: any) => {
    const { id, currentPassword, password, confirmPassword } = req.body;

    if(id === ""){
        return res.json({
            success: false,
            message: "Algo inesperado aconteceu.",
        });
    }

    if(currentPassword === ""){
        return res.json({
            success: false,
            message: "Preencha o campo da palavra-passe atual.",
        });
    }

    if(password === ""){
        return res.json({
            success: false,
            message: "Preencha o campo da nova palavra-passe.",
        });
    }

    if(confirmPassword === ""){
        return res.json({
            success: false,
            message: "Preencha o campo da confirmação da nova palavra-passe.",
        });
    }

    if(password !== confirmPassword){
        return res.json({
            success: false,
            message: "As palavras-passe não coincidem.",
        });
    }

    const user = await User.findById({ _id : id });

    if (user && (await bcrypt.compare(currentPassword, user.password))) {
        const update = await User.findByIdAndUpdate(
            { _id: id },
            { password: await bcrypt.hash(password, 10) }
        );

        if(update){
            return res.json({
                success: true,
                message: "Palavra-passe alterada com sucesso.",
            });
        }else{
            return res.json({
                success: false,
                message: "Não conseguimos realizar essa operação.",
            });
        }
    }else{
        return res.json({
            success: false,
            message: "A palavra-passe atual não coincide com a palavra-passe inserida.",
        });
    }
}

const UserController = {
    UserLogin,
    Register,
    ForgotPassword,
    ResetPassword,
    GetUser,
    UpdateUser,
    ChangeCurrentPassword,
}

export default UserController;