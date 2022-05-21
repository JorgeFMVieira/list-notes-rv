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
    const { title, content, token } = req.body;

    if(!title){
        return res.json({
            success: false,
            message: "Preencha o campo do título."
        });
    }

    if(!token){
        return res.json({
            success: false,
            message: "Introduza um utilizador"
        });
    }

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
    
    const user = tokenDecoded.user_id ;

    const findUser = await User.findById({ _id: user });

    if(findUser){
        const newNote = new Notes({
            title,
            content,
            user 
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
    }else{
        return res.json({
            success: false,
            message: "Não encontramos o utilizador."
        });
    }
}

const ListNotes = async (req: any, res: any) => {
    const { token, search, currentPage } = req.body;

    if(!token){
        return res.json({
            success: false,
            message: "Introduza um utilizador"
        });
    }

    jwt.verify(token, `${process.env.TOKEN_KEY}`, function(err: any, decoded: any) {
        if (err) {
            return res.json({
                tokenValid: false,
                success: false,
                message: "Acesso expirado."
            });
        }
    });

    const tokenDecoded = jwtSimple.decode(token, process.env.TOKEN_KEY as string);
    
    const user = tokenDecoded.user_id ;

    const findUser = await User.findById({ _id: user });

    if(findUser){
        const page = currentPage ? currentPage : 1;

        const limitItems = 2;
        var totalPages = 0;
        var countPage = 0;
        var notas = [];

        // Find Notes and count total items
        const [notes, count] = await Promise.all([
            Notes.find({ user: user }).skip((page - 1) * limitItems).limit(limitItems),
            Notes.countDocuments({ user: user }),
        ]);

        if(search){
            const [notes, count] = await Promise.all([
                Notes.find({ user: user, $text: { $search: search } }).skip((page - 1) * limitItems).limit(limitItems),
                Notes.countDocuments({ user: user, $text: { $search: search } }),
            ]);
            totalPages = Math.ceil(count / limitItems);
            notas = notes;
        }else{
            totalPages = Math.ceil(count / limitItems);
            notas = notes;
        }

        return res.json({
            success: true,
            obj: notas,
            totalPages: totalPages
        });

    }else{
        return res.json({
            success: false,
            message: "Não encontramos o utilizador."
        });
    }
}

const DetailsNote = async (req: any, res: any) => {
    const note = req.query.note;
    const { token } = req.body;

    if(!token){
        return res.json({
            tokenValid: false,
            success: false,
            message: "Introduza um utilizador"
        });
    }

    if(!note){
        return res.json({
            tokenValid: false,
            success: false,
            message: "Introduza uma nota"
        });
    }

    jwt.verify(token, `${process.env.TOKEN_KEY}`, function(err: any, decoded: any) {
        if (err) {
            return res.json({
                tokenValid: false,
                success: false,
                message: "Acesso expirado."
            });
        }
    });

    const tokenDecoded = jwtSimple.decode(token, process.env.TOKEN_KEY as string);
    
    const user = tokenDecoded.user_id ;

    const findUser = await User.findById({ _id: user });

    if(findUser){
        const findNote = await Notes.findOne({ _id: note, user: user });

        if(findNote){
            return res.json({
                success: true,
                obj: findNote
            });
        }else{
            return res.json({
                success: false,
                message: "Não encontramos a nota."
            });
        }

    }else{
        return res.json({
            success: false,
            message: "Não encontramos o utilizador."
        });
    }
}


const UpdateNotes = async (req: any, res: any) => {
    const { note, token, title, content } = req.body;

    if(!title){
        return res.json({
            success: false,
            message: "Preencha o campo do título."
        });
    }

    if(!token){
        return res.json({
            tokenValid: false,
            success: false,
            message: "Introduza um utilizador"
        });
    }

    if(!note){
        return res.json({
            tokenValid: false,
            success: false,
            message: "Introduza uma nota"
        });
    }

    jwt.verify(token, `${process.env.TOKEN_KEY}`, function(err: any, decoded: any) {
        if (err) {
            return res.json({
                tokenValid: false,
                success: false,
                message: "Acesso expirado."
            });
        }
    });

    const tokenDecoded = jwtSimple.decode(token, process.env.TOKEN_KEY as string);
    
    const user = tokenDecoded.user_id ;

    const findUser = await User.findById({ _id: user });

    if(findUser){
        const findNote = await Notes.findOne({ _id: note, user: user });

        if(findNote){
            const update = await Notes.findOneAndUpdate(
                { _id: note, user: user },
                { 
                    title: title, 
                    content: content
                },
            );

            if(update){
                return res.json({
                    success: true,
                    message: "Nota atualizada com sucesso."
                });
            }else{
                return res.json({
                    success: false,
                    message: "Não foi possível atualizar a nota."
                });
            }
        }else{
            return res.json({
                success: false,
                message: "Não encontramos a nota."
            });
        }

    }else{
        return res.json({
            success: false,
            message: "Não encontramos o utilizador."
        });
    }
}

export default {
    CreateNote,
    ListNotes,
    UpdateNotes,
    DetailsNote,
}