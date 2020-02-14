const mongoose = require('mongoose')

// mongoose.connect('mongodb://127.0.0.1:27017/house-system-api', {
mongoose.connect(process.env.MONGODB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
})
.then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));