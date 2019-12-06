const mongoose = require('mongoose')
const User = require('./User')
const { Schema } = mongoose;


const whiteListSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    }
})

whiteListSchema.pre('findOneAndDelete', { query: true }, async function(next) {
    const whiteListEmailId = this.getQuery()._id
    
    try{
        await User.findOneAndDelete({ whiteListEmailId }) 
    } catch(e) {
        console.log('error')
    }

    next()
})

module.exports = mongoose.model('WhiteList', whiteListSchema)