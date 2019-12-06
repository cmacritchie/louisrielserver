const mongoose = require('mongoose')
const HousePoints = require('./HousePoints')
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

userSchema.pre('findOneAndDelete', async function(next) {
    const user = await User.findOne(this.getQuery())

    try {
        await HousePoints.deleteMany({ owner: user._id })
    } catch (e) {
        console.log('no House Points to Delete')
    }
    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User