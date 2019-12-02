const mongoose = require('mongoose')
const { Schema } = mongoose;

const userSchema = new Schema({
    googleId: String,
    name: String,
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    whiteListEmailId: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'WhiteList'
    },
    admin:{
        type:Boolean,
        default: false
    },
    apexAdmin:{
        type:Boolean,
        default: false
    }
})

module.exports = mongoose.model('User', userSchema)