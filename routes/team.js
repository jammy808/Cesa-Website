const mongoose = require('mongoose');

const teamSchema = mongoose.Schema({
  
  name : String,
  post : String,
  pos : String,
  title : String,
  image : String,
  
})

module.exports = mongoose.model('Team',teamSchema);