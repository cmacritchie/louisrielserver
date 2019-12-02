const mongoose = require('mongoose')
const { Schema } = mongoose

const housePointSchema = new Schema({
    eagle:{
        type:Number,
        required:false
    },
    bear:{
        type:Number,
        required:false
    },
    turtle:{
        type:Number,
        required:false
    },
    wolf:{
        type:Number,
        required:false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('HousePoints', housePointSchema)