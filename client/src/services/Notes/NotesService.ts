import { MessagingHelper } from "../../helpers/MessagingHelper";
import { CreateNote } from "../../models/Notes/CreateNote";
import { DeleteNote } from "../../models/Notes/DeleteNote";
import { DetailsNote } from "../../models/Notes/DetailsNote";
import { EditNote } from "../../models/Notes/EditNote";
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

    EditNote = async (data: EditNote): Promise<MessagingHelper<boolean>> => {
        const response = await Api.post("/updateNotes", { ...data });
        return response.data;
    }

    DeleteNote = async (data: DeleteNote): Promise<MessagingHelper<boolean>> => {
        const response = await Api.post("/deleteNote", { ...data });
        return response.data;
    }
}