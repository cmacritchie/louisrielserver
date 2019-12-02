const express = require('express')
const passport = require('passport');
const router = new express.Router()

router.get('/auth/google', 
            passport.authenticate('google', {
                scope: ['profile', 'email']
                }) 
)

router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/LoginError'}), (req, res) => {
    res.redirect('/');
})


router.get('/api/logout', (req, res) => {
    req.logout(); //added on by passport

    res.send(req.user);
})

router.get('/api/current_user', (req, res) => {

    if(!req.user){
        res.status(404).send()
    }

    res.send(req.user)
})

router.get('/api/test', (req, res) => {
    res.send('back streets back alright!')
})

//patch

module.exports = router