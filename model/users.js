const mongoose = require('mongoose');

const users = mongoose.model('User',{
    fullName: {
        type: String,
    },
    email: {
        type: String,
    },
    username:{
        type: String,
    },
    password:{
        type: String,
    },
    photo:{
        type: String,
    },
    lastOnline:{
        type: String,
    },
    balance: {
        type: String,
    },
})

module.exports = users 