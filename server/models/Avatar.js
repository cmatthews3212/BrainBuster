const { Schema } = require('mongoose');

const avatarSchema = new Schema({
    src: {
        type: String,
        required: true,
    },
 
});

module.exports = {avatarSchema};