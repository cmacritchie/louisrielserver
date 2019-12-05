const express = require('express')
const Admin = require('../models/Admin')
const WhiteList = require('../models/WhiteList')
const HousePoints = require('../models/HousePoints')
const User = require('../models/User')
const router = new express.Router()

router.post('/api/admin', async (req, res) => {
    
    const admin = new Admin(req.body)
    try{
        await admin.save()
        res.status(201).send(admin)
    } catch(e) {
        res.status(400).send(e)
    }
})

router.get('/api/admin', async (req, res) => {
    try {
        const admins = await Admin.find({}).sort({email: -1})
        res.send(admins)
    } catch (e) {
        res.status(500).send()
    }
})

router.patch('/api/admin/:id', async (req, res) => {
    delete req.body._id
    const updates = Object.keys(req.body)
    const allowedUpdates = ['email']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if(!isValidOperation){
        return res.status(400).send({error: 'Invalid updates!'})
    }

    try {
        const adminItem = await Admin.findOneAndUpdate({ _id:req.params.id}, req.body, { new: true, runValidators: true})

        if(!adminItem){
            return res.status(404).send()
        }

        res.send(adminItem)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/api/admin/:id', async (req, res)=> {
    try {
        const adminItem = await Admin.findByIdAndDelete(req.params.id)

        if(!adminItem){
            res.status(404).send()
        }

        res.send(adminItem)
    } catch (e) {
        res.status(500).send()
    }
})

router.post('/api/whitelist', async (req, res) => {
    const whiteList = new WhiteList(req.body)

    try {
        await whiteList.save()
        res.status(201).send(whiteList)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/api/whitelist', async (req, res) => {
    try {
        //const whiteList = await WhiteList.find({}).sort({email: -1})

        const whiteList = await WhiteList.aggregate([
                            { 
                                $lookup : {
                                    from: "users",
                                    localField: "_id",
                                    foreignField: "whiteListEmailId",
                                    as: "user"
                
                                }
                            }
                        ])

        res.send(whiteList)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.patch('/api/whitelist/:id', async (req, res) => {
    delete req.body._id
    const updates = Object.keys(req.body)
    const allowedUpdates = ['email']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if(!isValidOperation){
        return res.status(400).send({error: 'Invalid updates!'})
    }

    try {
        const whitelistItem = await WhiteList.findOneAndUpdate({ _id:req.params.id}, req.body, { new: true, runValidators: true})

        if(!whitelistItem){
            return res.status(404).send()
        }

        res.send(whitelistItem)
    } catch (e) {
        res.status(400).send(e)
    }
})

/
router.delete('/api/whiteList/:id', async (req, res)=> {
    try {
        const whiteListItem = await WhiteList.findOneAndDelete({ _id:req.params.id})
        
        if(!whiteListItem){
            res.status(404).send()
        }

        res.send(whiteListItem)
    } catch (e) {
        res.status(500).send()
    }
})


module.exports = router