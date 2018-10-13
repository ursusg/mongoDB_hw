var mongoose = require('mongoose');

// Mongoose creates a Schema similar to MySQL
var Schema = mongoose.Schema;

// Create a Schema Object equal to the variable
// ArticleSchema
var ArticleSchema = new Schema({
    title: {
        type: String,
        require: true
    },
    link: {
        type: String,
        required: true
    },
    note: {
        type: Schema.Types.ObjectId,
        ref: "Note"
    }
});

// Create the model called "Article" based on the new
// ArticleSchema variable. Relates to the new variable
// just titled Article.
var Article = mongoose.model("Article", ArticleSchema);

// Export the created Model/Schema based off of
// Mongoose.
module.exports = Article;