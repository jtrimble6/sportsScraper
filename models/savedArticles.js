var mongoose = require('mongoose')

var Schema = mongoose.Schema

var SavedArticleSchema = new Schema ({
    title: {
        type: String,
        required: true
    },

    link: {
        type: String,
        required: true
    },

    note: {
        type: Schema.Types.ObjectId,
        ref: 'Note'
    }
})

var SavedArticles = mongoose.model('SavedArticles', SavedArticleSchema)

module.exports = SavedArticles