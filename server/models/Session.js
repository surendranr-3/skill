const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema({
  learner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  mentor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  skill: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  duration: { type: Number, required: true },
  cost: { type: Number, required: true },
  
  status: { 
    type: String, 
    enum: ['scheduled', 'completed', 'cancelled', 'missed'], 
    default: 'scheduled' 
  },
  
  roomId: { type: String },

  // 🚨 Review Data Structure
  review: {
    rating: { type: Number },
    comment: { type: String }
  },
  
  // 🚨 NEW: Explicitly track exactly when the review was submitted
  reviewedAt: { type: Date }

}, { timestamps: true }); // Ensure createdAt and updatedAt are generated

module.exports = mongoose.model('Session', SessionSchema);