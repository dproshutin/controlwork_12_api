const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PictureSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

const Picture = mongoose.model("Picture", PictureSchema);

module.exports = Picture;