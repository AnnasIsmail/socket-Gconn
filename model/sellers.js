const mongoose = require('mongoose');

const sellers = mongoose.model('Seller',{
    sellerName: {
        type: String,
    },
    slogan: {
        type: String,
    },
    photo:{
        type: String,
    },
    idUser:{
        type: String,
        required: true
    },
    lastOnline:{
        type: String,
    },
})

module.exports = sellers