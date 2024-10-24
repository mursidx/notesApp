const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://mursid_notes:mursid786@cluster0.afrcf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
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

