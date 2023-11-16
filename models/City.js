const mongoose = require('mongoose');
const City = mongoose.model('City', { name: String, state: { type: mongoose.Types.ObjectId } });
module.exports = City