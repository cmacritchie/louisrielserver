const express = require('express')
const HousePoints = require('../models/HousePoints')
const User = require('../models/User')
const mongoose = require('mongoose')
const userAuth = require('../middleware/userAuth')
// const adminAuth = require('../middleware/adminAuth')
// const apexAdmin = require('../middleware/apexAuth')


const router = new express.Router()

router.post('/api/house', userAuth, async (req, res) => {
    console.log(req.user._id)
    const housePoints = new HousePoints({
        ...req.body,
        owner: req.user._id
    }) 

    try {
        await housePoints.save()
        res.status(201).send(housePoints)
    } catch (e) {
        res.status(400).send(e)
    }
})

// router.get('/api/house', async (req, res) => {
//     try {
//         const housePoints = await HousePoints.find({}).sort({updatedAt: -1})
//         res.send(housePoints)
//     } catch (e) {
//         res.status(500).send()
//     }
// })

router.get('/api/house', async (req, res) => {
    try {
        const housePoints = await HousePoints.aggregate([
            {
                $group:
                  {
                    _id: null,
                    wolf: { $sum: "$wolf" },
                    eagle: { $sum: "$eagle" },
                    turtle: { $sum: "$turtle" },
                    bear: { $sum: "$bear" },
                    
                  }
              }

        ])
        res.send(housePoints)
    } catch (e) {
        console.log(e)
        res.status(500).send()
    }
})

//for admin purposes
router.get('/api/userpoints/:id', userAuth, async (req, res) => {
    const id = req.params.id
    try {
        const housePoints = await User.aggregate([
                            { $match: 
                                { _id: mongoose.Types.ObjectId(id) } 
                            },
                            { 
                                $lookup : {
                                    from: "housepoints",
                                    localField: "_id",
                                    foreignField: "owner",
                                    as: "housePoints"
                
                                }
                            }
            
        ])
        res.send(housePoints)
    } catch (e) {
        console.log(e)
        res.status(500).send()
    }
})


router.get('/api/house/:id', userAuth, async (req, res) => {
    const _id = req.params.id

    try {
        const housePoints = await HousePoints.findOne({ _id})

        if(!housePoints) {
            return res.status(404).send()
        }

        res.send(housePoints)
    } catch (e) {
        res.status(500).send()
    }
})


// router.get('/api/myhouse', async (req, res) => {
//     console.log('in')
//     try {
//         const myhousePoints = await HousePoints.find({owner:req.user._id}).sort({updatedAt: -1})
//         res.send(myhousePoints)
//     } catch (e) {
//         res.status(500).send()
//     }
    
// })

//refactor
router.delete('/api/house/:id', userAuth, async (req, res) => {
    try {
        let myhousePoints

    //if req.user == admin || apexAdmin 
    if(req.user.admin || req.user.apexAdmin ){
        console.log('admin delete')
        myhousePoints = await HousePoints.findOneAndDelete({_id: req.params.id})
    } else {
        console.log('user delete')
        myhousePoints = await HousePoints.findOneAndDelete({_id: req.params.id, owner: req.user._id})
    }

    //else
    //HousePoints.findbyIdandDelete(req.params.id)
    res.send(myhousePoints)
    } catch (e) {
        res.status(500).send()
    }
})

router.patch('/api/house/:id', async (req, res) => {
    delete req.body._id
    const updates = Object.keys(req.body)
    const allowedUpdates = ['wolf', 'turtle', 'bear', 'eagle']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if(!isValidOperation){
        return res.status(400).send({error: 'Invalid updates!'})
    }

    try {
        //if admin
        const housePoints = await HousePoints.findOneAndUpdate({ _id:req.params.id}, req.body, { new: true, runValidators: true})

        //if not admin
        // const housePoints = await HousePoints.findOneAndUpdate({ _id:req.params.id, owner:req.user._id}, req.body, { new: true, runValidators: true})

        if(!housePoints) {
            return res.status(404).send()
        }
        
        res.send(housePoints)
    } catch (e) {
        res.status(400).send(e)
    }
})

module.exports = router