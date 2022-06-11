import mongoose from "mongoose";

const notesSchema = new mongoose.Schema({
    title: { type: String, default: null },
    content: {type: String, default: null},
    user: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    createdAt: {type: Date, default: Date.now},
});

notesSchema.index({
    title: "text",
    createdAt: "text"
});

const Notes = mongoose.model("notes", notesSchema);

Notes.createIndexes();

export default Notes;