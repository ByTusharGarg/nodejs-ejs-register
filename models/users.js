const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    dob: { type: Date, required: true },
    age: { type: Number }, // Update if needed
    country: { type: String, required: true },
    state: { type: String, required: true },
    city: { type: String, required: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
});

const User = mongoose.model('User', UserSchema);
module.exports = User