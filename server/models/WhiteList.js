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
    const user = await User.findOneAndDelete({ whiteListEmailId })  //.findOne(this.getQuery()) 
    
    console.log(user)
    console.log(whiteListEmailId)

    next()
})

// whiteListSchema.post('deleteOne', async function(next) {
//     const whiteList = this
//     console.log('whiteList')
//     console.log(whiteList._id)
//     // const query = this.getQuery()
//     // console.log('query')
//     // console.log(query)
//     try{
//         const user = await User.findOneAndDelete({whiteListEmailId:whiteList._id})
//         console.log('user')
//         console.log(user)
//     } catch(e){
//         console.log('no user to delete')
//     }
//     next()
// })

// whiteListSchema.pre('findOneAndDelete', { query: true}, async function(next) {
//     console.log('white list delete') 
//     const whiteList = this
//     console.log(whiteList)
//     console.log(this)
//     const user = await User.find({whiteListEmailId:whiteList._id})
//     // console.log('whitelist Id')
//     // console.log(whiteListEmailId)
//     // console.log(user)
//     // console.log(user.whiteListEmailId)
//     next()
// })


module.exports = mongoose.model('WhiteList', whiteListSchema)