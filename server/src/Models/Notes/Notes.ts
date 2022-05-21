import mongoose from "mongoose";

const notesSchema = new mongoose.Schema({
    title: { type: String, default: null },
    content: {type: String, default: null},
    user: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
});

notesSchema.index({
    "title": "text",
});

const Notes = mongoose.model("notes", notesSchema);

Notes.createIndexes();

export default Notes;