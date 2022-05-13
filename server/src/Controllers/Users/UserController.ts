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
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email,
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

const UserController = {
    UserLogin,
    Register,
    ForgotPassword,
    ResetPassword,
}

export default UserController;