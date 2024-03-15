const mongoose = require('mongoose');

const eventSchema = mongoose.Schema({
  admin : {
    type : mongoose.Schema.Types.ObjectId,
    ref : "Admin"
  },
  title : String,
  description : String,
  image : String,
  eventDate : Date,

  public : {
    type : Array,
    default : []
  },
})

module.exports = mongoose.model('Event',eventSchema);