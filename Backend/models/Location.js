const mongoose = require('mongoose');

const LocationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  // GeoJSON format: [longitude, latitude]
  coordinates: {
    type: [Number], 
    required: true
  }
});

module.exports = mongoose.model('Location', LocationSchema);