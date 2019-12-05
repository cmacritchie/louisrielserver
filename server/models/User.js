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
    console.log('at user')
    console.log(this.getQuery())
    const user = await User.findOne(this.getQuery())
    console.log('here is the user')
    console.log(user._id)
    const housepoint = await HousePoints.deleteMany({ owner: user._id })
    console.log('das housen poin')
    console.log(housepoint)
    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User