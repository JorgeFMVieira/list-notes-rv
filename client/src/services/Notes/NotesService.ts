import { MessagingHelper } from "../../helpers/MessagingHelper";
import { GetAllNotes } from "../../models/Notes/GetAllNotes";
import { ListNotes } from "../../models/Notes/ListNotes";
import { Pagination } from "../../models/Pagination";
import Api from "../../providers/Api";

export class NotesService {
    ListNotes = async (data: ListNotes): Promise<Pagination<GetAllNotes>> => {
        const response = await Api.post("/listNotes", { ...data });
        return response.data;
    }
}