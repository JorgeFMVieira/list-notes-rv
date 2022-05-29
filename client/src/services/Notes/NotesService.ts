import { MessagingHelper } from "../../helpers/MessagingHelper";
import { CreateNote } from "../../models/Notes/CreateNote";
import { DetailsNote } from "../../models/Notes/DetailsNote";
import { GetAllNotes } from "../../models/Notes/GetAllNotes";
import { ListNotes } from "../../models/Notes/ListNotes";
import { Pagination } from "../../models/Pagination";
import Api from "../../providers/Api";

export class NotesService {
    ListNotes = async (data: ListNotes) : Promise<Pagination<GetAllNotes>> => {
        const response = await Api.post("/listNotes", { ...data });
        return response.data;
    }

    DetailsNote = async (data: any, user: any) : Promise<MessagingHelper<DetailsNote>> => {
        const response = await Api.post("/detailsNotes?note=" + data.note, { ...user });
        return response.data;
    }

    CreateNote = async (data: CreateNote) : Promise<MessagingHelper<CreateNote>> => {
        const response = await Api.post("/createNote", { ...data });
        return response.data;
    }
}