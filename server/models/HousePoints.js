const mongoose = require('mongoose')
const { Schema } = mongoose

const housePointSchema = new Schema({
    eagle:{
        default:0,
        type:Number,
        required:false
    },
    bear:{
        default:0,
        type:Number,
        required:false
    },
    turtle:{
        default:0,
        type:Number,
        required:false
    },
    wolf:{
        default:0,
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


housePointSchema.pre('save', function(next) {
    const entryFields = ['eagle', 'bear', 'turtle', 'wolf']

    entryFields.forEach(field => {
        if(this[field]=== null) {
            this[field] = 0
        }
    })
    next()
})

module.exports = mongoose.model('HousePoints', housePointSchema)