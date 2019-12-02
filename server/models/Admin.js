const mongoose = require('mongoose')
const { Schema } = mongoose;

const AdminSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    }
})

module.exports = mongoose.model('Admin', AdminSchema)

