const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  purpose: {
    type: String,
    required: true
  },
  date: {
    type: Date
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'denied'],
    default: 'pending'
  }
});

visitorSchema.pre('save', function(next) {
  this.date = Date.now() + 60 * 60 * 1000;
  next();
});
const Visitor = mongoose.model('Visitor', visitorSchema);

module.exports = Visitor;
