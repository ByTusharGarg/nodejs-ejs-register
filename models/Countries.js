const mongoose = require('mongoose');

const Country = mongoose.model('Country', { name: String });
module.exports = Country