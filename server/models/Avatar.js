const { Schema } = require('mongoose');

const avatarSchema = new Schema({
    seed: {
            type: String,
            required: true,
    },
    src: {
        type: String,
        required: true,
    },
    size: {
        type: Number,
    },
    hair:{
            type: String,
    },
 
});

module.exports = avatarSchema;