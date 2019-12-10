const express = require('express')
const Admin = require('../models/Admin')
const WhiteList = require('../models/WhiteList')
const HousePoints = require('../models/HousePoints')
const User = require('../models/User')
const router = new express.Router()

const adminAuth = require('../middleware/adminAuth')
const apexAuth = require('../middleware/apexAuth')

router.post('/api/admin', apexAuth, async (req, res) => {
    
    const admin = new Admin(req.body)
    try{
        await admin.save()
        res.status(201).send(admin)
    } catch(e) {
        res.status(400).send(e)
    }
})

router.get('/api/admin', apexAuth, async (req, res) => {
    try {
        const admins = await Admin.find({}).sort({email: -1})
        res.send(admins)
    } catch (e) {
        res.status(500).send()
    }
})

router.patch('/api/admin/:id', apexAuth, async (req, res) => {
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

router.delete('/api/admin/:id', apexAuth, async (req, res)=> {
    
    try {
        const adminItem = await Admin.findOneAndDelete({ _id: req.params.id })

        if(!adminItem){
            res.status(404).send()
        }

        res.send(adminItem)
    } catch (e) {
        res.status(500).send()
    }
})

router.post('/api/whitelist', adminAuth, async (req, res) => {
    const whiteList = new WhiteList(req.body)

    try {
        await whiteList.save()
        res.status(201).send(whiteList)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/api/whitelist', adminAuth, async (req, res) => {
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

router.patch('/api/whitelist/:id', adminAuth, async (req, res) => {
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
router.delete('/api/whiteList/:id', adminAuth, async (req, res)=> {
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