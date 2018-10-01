var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
  headline: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  photo: {
    type: String,
    required: true
  },
  summary: {
    type: String,
    required: true
  },
  comments: {
    type: Schema.Types.ObjectId,
    ref: "Comment"
  }
});

var Article = mongoose.model("Article", ArticleSchema);

// Export the Article model
module.exports = Article;
