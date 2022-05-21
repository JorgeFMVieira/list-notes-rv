import { MessagingHelper } from "../../helpers/MessagingHelper";
import { ListNotes } from "../../models/Notes/ListNotes";
import Api from "../../providers/Api";

export class NotesService {
    ListNotes = async (data: ListNotes): Promise<MessagingHelper<ListNotes>> => {
        const response = await Api.post("/listNotes", { ...data });
        return response.data;
    }
}