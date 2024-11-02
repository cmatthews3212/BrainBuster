const { Schema } = require('mongoose');

const avatarSchema = new Schema({
    avatarId: {
        type: Schema.Types.ObjectId,
        required: true,
    },
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

module.exports = {avatarSchema};