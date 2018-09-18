var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var CommentSchema = new Schema({
   body: String,
   date: Date
});

CommentSchema.methods.createdOn = function() {
  this.date = Date.now();
  return this.date;
}

var Comment = mongoose.model("Comment", CommentSchema);

module.exports = Comment;