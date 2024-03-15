const mongoose = require('mongoose');

const pastEventSchema = mongoose.Schema({

  title : String,
  description : String,
  image : String,
  eventDate : Date,

  public : {
    type : Array,
    default : []
  },
})

module.exports = mongoose.model('pastEvent',pastEventSchema);