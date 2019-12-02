const mongoose = require('mongoose')
const { Schema } = mongoose;

const ApexAdminSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    }
})

module.exports = mongoose.model('ApexAdmin', ApexAdminSchema)