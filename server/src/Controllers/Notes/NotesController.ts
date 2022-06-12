import Notes from '../../Models/Notes/Notes';
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import validator from 'email-validator';
import sgMail from "../../Config/Email/EmailConfig";
import jwtSimple from "jwt-simple";
import User from '../../Models/Users/User';
import mongoose from 'mongoose';

dotenv.config();

const CreateNote = async (req: any, res: any) => {
    try {
        const { title, content, token } = req.body;

        if (!title) {
            return res.json({
                success: false,
                message: "Preencha o campo do título."
            });
        }

        if (!token) {
            return res.json({
                success: false,
                message: "Introduza um utilizador."
            });
        }

        jwt.verify(token, `${process.env.TOKEN_KEY}`, async function (err: any, decoded: any) {
            if (err) {
                return res.json({
                    tokenValid: false,
                    success: false,
                    message: "Acesso expirado.",
                    field: "all"
                });
            } else {

                const tokenDecoded = jwtSimple.decode(token, process.env.TOKEN_KEY as string);

                const user = tokenDecoded.user_id;

                const findUser = await User.findById({ _id: user });

                if (findUser) {
                    const newNote = new Notes({
                        title,
                        content,
                        user,
                        createdAt: Date.now()
                    });

                    try {
                        const note = await newNote.save();
                        return res.json({
                            success: true,
                            data: note
                        });
                    } catch (error) {
                        return res.json({
                            success: false,
                            message: error
                        });
                    }
                } else {
                    return res.json({
                        success: false,
                        message: "Não encontramos o utilizador."
                    });
                }
            }
        });
    }
    catch {
        return res.json({
            success: false,
            message: "Algo inesperado aconteceu."
        });
    }
}

const ListNotes = async (req: any, res: any) => {
    try {
        const { token, search } = req.body;

        if (!token) {
            return res.json({
                success: false,
                message: "Introduza um utilizador."
            });
        }

        jwt.verify(token, `${process.env.TOKEN_KEY}`, async function async(err: any) {
            if (err) {
                return res.json({
                    tokenValid: false,
                    success: false,
                    message: "Parece que o acesso já expirou.",
                    field: "all"
                });
            } else {
                const tokenDecoded = jwtSimple.decode(token, process.env.TOKEN_KEY as string);

                const user = tokenDecoded.user_id;

                const findUser = await User.findById({ _id: user });

                if (findUser) {
                    var notas = [];

                    // Find Notes and count total items
                    const [notes] = await Promise.all([
                        Notes.find({ user: user }).sort({ createdAt: -1}),
                        Notes.countDocuments({ user: user }).sort({ createdAt: -1}),
                    ]);

                    if (search) {
                        const [notes] = await Promise.all([
                            Notes.find({ user: user, title: { $regex: search.trim(), $options: "i" } }).sort({ createdAt: -1}),
                            Notes.countDocuments({ user: user, title: { $regex: search.trim(), $options: "i" } }).sort({ createdAt: -1}),
                        ]);
                        notas = notes;
                    } else {
                        notas = notes;
                    }

                    return res.json({
                        success: true,
                        obj: notas
                    });

                } else {
                    return res.json({
                        success: false,
                        message: "Não encontramos o utilizador."
                    });
                }
            }
        });
    } catch {
        return res.json({
            success: false,
            message: "Erro ao listar as notas."
        });
    }
}

const DetailsNote = async (req: any, res: any) => {
    try {
        const note = req.query.note;
        const { token } = req.body;

        if (!token) {
            return res.json({
                tokenValid: false,
                success: false,
                message: "Introduza um utilizador"
            });
        }

        if (!note) {
            return res.json({
                tokenValid: false,
                success: false,
                message: "Introduza uma nota"
            });
        }

        jwt.verify(token, `${process.env.TOKEN_KEY}`, async function (err: any, decoded: any) {
            if (err) {
                return res.json({
                    tokenValid: false,
                    success: false,
                    message: "Acesso expirado."
                });
            } else {
                const tokenDecoded = jwtSimple.decode(token, process.env.TOKEN_KEY as string);

                const user = tokenDecoded.user_id;

                const findUser = await User.findById({ _id: user });

                if (findUser) {
                    const findNote = await Notes.findOne({ _id: note, user: user });

                    if (findNote) {
                        return res.json({
                            success: true,
                            obj: findNote
                        });
                    } else {
                        return res.json({
                            success: false,
                            message: "Não encontramos a nota."
                        });
                    }

                } else {
                    return res.json({
                        success: false,
                        message: "Não encontramos o utilizador."
                    });
                }
            }
        });
    }
    catch {
        return res.json({
            success: false,
            message: "Algo inesperado aconteceu."
        });
    }
}


const UpdateNotes = async (req: any, res: any) => {
    try {
        const { note, token, title, content } = req.body;

        if (!title) {
            return res.json({
                success: false,
                message: "Preencha o campo do título."
            });
        }

        if (!token) {
            return res.json({
                tokenValid: false,
                success: false,
                message: "Introduza um utilizador"
            });
        }

        if (!note) {
            return res.json({
                tokenValid: false,
                success: false,
                message: "Introduza uma nota"
            });
        }

        jwt.verify(token, `${process.env.TOKEN_KEY}`, async function (err: any, decoded: any) {
            if (err) {
                return res.json({
                    tokenValid: false,
                    success: false,
                    message: "Acesso expirado."
                });
            } else {

                const tokenDecoded = jwtSimple.decode(token, process.env.TOKEN_KEY as string);

                const user = tokenDecoded.user_id;

                const findUser = await User.findById({ _id: user });

                if (findUser) {
                    const findNote = await Notes.findOne({ _id: note, user: user });

                    if (findNote) {
                        const update = await Notes.findOneAndUpdate(
                            { _id: note, user: user },
                            {
                                title: title,
                                content: content
                            },
                        );

                        if (update) {
                            return res.json({
                                success: true,
                                message: "Nota atualizada com sucesso."
                            });
                        } else {
                            return res.json({
                                success: false,
                                message: "Não foi possível atualizar a nota."
                            });
                        }
                    } else {
                        return res.json({
                            success: false,
                            message: "Não encontramos a nota."
                        });
                    }

                } else {
                    return res.json({
                        success: false,
                        message: "Não encontramos o utilizador."
                    });
                }
            }
        });
    }
    catch {
        return res.json({
            success: false,
            message: "Ocorreu um erro ao atualizar a nota. Tente novamente."
        });
    }
}

const DeleteNote = async (req: any, res: any) => {
    try{
        const { note, token } = req.body;

        if (!token) {
            return res.json({
                tokenValid: false,
                success: false,
                message: "Introduza um utilizador"
            });
        }

        if (!note) {
            return res.json({
                success: false,
                message: "Introduza uma nota"
            });
        }

        jwt.verify(token, `${process.env.TOKEN_KEY}`, async function (err: any, decoded: any) {
            if (err) {
                return res.json({
                    tokenValid: false,
                    success: false,
                    message: "Acesso expirado."
                });
            } else {

                const tokenDecoded = jwtSimple.decode(token, process.env.TOKEN_KEY as string);

                const user = tokenDecoded.user_id;

                const findUser = await User.findById({ _id: user });

                if (findUser) {
                    const findNote = await Notes.findOne({ _id: note, user: user });

                    if (findNote) {
                        const deleteNote = await Notes.deleteOne(
                            { _id: note },
                        );

                        if (deleteNote) {
                            return res.json({
                                success: true,
                                message: "A nota foi eliminada com sucesso."
                            });
                        } else {
                            return res.json({
                                success: false,
                                message: "Não foi possível eliminar a nota."
                            });
                        }
                    } else {
                        return res.json({
                            success: false,
                            message: "Não encontramos a nota."
                        });
                    }

                } else {
                    return res.json({
                        success: false,
                        message: "Não encontramos o utilizador."
                    });
                }
            }
        }); 
    }
    catch{
        return res.json({
            success: false,
            message: "Ocorreu um erro ao eliminar a nota. Tente novamente."
        });
    }
}

export default {
    CreateNote,
    ListNotes,
    UpdateNotes,
    DetailsNote,
    DeleteNote,
}