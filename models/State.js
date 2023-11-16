
const mongoose = require('mongoose');
const State = mongoose.model('State', { name: String, country: { type: mongoose.Types.ObjectId } });
module.exports = State