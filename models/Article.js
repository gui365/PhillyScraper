var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var AtricleSchema = new Schema({
   title: {
     type: String,
     trim: true,
     required: true
   },
   description: {
     type: String,
     trim: true,
     required: true
   },
   link: {
     type: String,
     required: true
   },
   comment: {
     type: Schema.Types.ObjectId,
     ref: "Comment"
   }
});

var Article = mongoose.model("Article", AtricleSchema);

module.exports = Article;