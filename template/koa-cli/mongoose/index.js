let config = require('../config.js').mongodb
let mongoose = require('mongoose')
mongoose.connect(`mongodb://${config.username}:${config.password}@localhost:27017/${config.dataBaseName}`, { useNewUrlParser: true })
    .then(() => {
        console.log("connecting")
    }, err => {
        console.log(err)
})

