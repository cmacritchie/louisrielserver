const mongoose = require('mongoose')
const User = require('./User')
const { Schema } = mongoose;

const adminSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    }
})

adminSchema.pre('findOneAndDelete', { query: true }, async function(next) {
    const admin = await Admin.findOne(this.getQuery())
console.log(admin.email)
    try {
        await User.findOneAndDelete({ email: admin.email })
    } catch(e) {
        console.log('no user to Delete')
    }
    next()
})

const Admin = mongoose.model('Admin', adminSchema)

module.exports = Admin

