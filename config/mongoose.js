const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URI)
const db = mongoose.connection;

//set up debugging
require('dotenv').config();
const debuglog = require('debug')('development:mongoose');

db.on('error',function(err){
    debuglog(err)
})

db.on('open',function(){
    debuglog('Connected to database')
})

module.exports = db;

