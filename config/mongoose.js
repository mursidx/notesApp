const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/myNotesDB')
const db = mongoose.connection;
// mongoose.connect('mongodb://127.0.0.1:27017/notesAppDB')
// const db = mongoose.connection;

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

