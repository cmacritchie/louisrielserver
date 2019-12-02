const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const mongoose = require('mongoose');
const User = require('../models/User')
const Admin = require('../models/Admin')
const WhitelList = require('../models/WhiteList')
//const User = mongoose.model('User') //this is cleaner for testing purposes

//refer to this for more good stuff
//https://stackoverflow.com/questions/24352975/passport-google-oauth-on-localhost

//used for cookies
passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser( async (id, done) => {
    const user = await User.findById(id)
    done(null, user)

})

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: '/auth/google/callback',
            proxy: true 
        }, 
        async (accessToken, refreshToken, profile, done) => {
            const email = profile._json.email
            
            const [ whiteList, adminList, existingUser ] = await Promise.all([
                await WhitelList.findOne({email}),
                await Admin.findOne({email}),
                await User.findOne({ googleId: profile.id})
            ])
            ///promise All
            ///whiteList
            //admin


            // const existingUser = await User.findOne({ googleId: profile.id})
            if (existingUser) {
                done(null, existingUser)
            } else {
                
                if(!whiteList && !adminList){
                   return done()
                }
                let admin = false
                if(adminList){
                    admin = true
                }
                
                const newUser = await new User({ googleId: profile.id, 
                                                 name: profile.displayName,
                                                // email,
                                                 whiteListEmailId: whiteList ? whiteList._id : undefined,
                                                 admin
                                                }).save()
                done(null, newUser)
            }
            
        }
    )
);