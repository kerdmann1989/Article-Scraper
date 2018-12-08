//Require mongoose
var mongoose = require("mongoose");

//Create schema class
var Schema = mongoose.Schema;


// /Create notes schema
var NoteSchema = new Schema({
    title: String,
    body: String
});
// var NoteSchema = new Schema({
//     body: {
//         type: String
//     },
//     article: {
//         type: Schema.Types.ObjectId,
//         ref: "Article"
//     }
// });

var Note = mongoose.model("Note", NoteSchema);

module.exports = Note;