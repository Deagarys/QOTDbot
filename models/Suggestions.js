const {Schema, model} = require("mongoose");
const suggestionSchema = new Schema({
    question: {
        type: String,
        required: true,
    },
    approved: {
        type: Boolean,
        required: true,
    },
    messageId: {
        type: String,
        required: true,
    },
    asked: {
        type: Boolean,
        required: true,
    },
    imageUrl: {
        type: String,
        required: false
    },
});

module.exports = model('Suggest', suggestionSchema);