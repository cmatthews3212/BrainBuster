const { Schema } = require('mongoose');

const avatarSchema = new Schema({
    src: {
        type: String,
        default: "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3…-161%20-83)%22%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E",
    },
 
});

module.exports = {avatarSchema};