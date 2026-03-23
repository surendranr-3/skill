// const mongoose = require('mongoose');

// const UserSchema = new mongoose.Schema({
//   name: { 
//     type: String, 
//     required: [true, "Name is required"] 
//   },
//   email: { 
//     type: String, 
//     required: [true, "Email is required"], 
//     unique: true 
//   },
//   password: { 
//     type: String, 
//     required: [true, "Password is required"]
//   },
//   role: { 
//     type: String, 
//     enum: ['user', 'admin'], 
//     default: 'user' 
//   },
  
//   // 🚨 CRITICAL: Banned Status Flag
//   isBanned: { type: Boolean, default: false },

//   walletBalance: { type: Number, default: 100 },
  
//   // Profile Fields
//   hourlyRate: { type: Number, default: 20 }, 
//   skills: [{ name: String, level: String }], 
//   learningInterests: [String], 
//   bio: { type: String, default: "" },
//   avatar: { type: String },

//   isOnboarded: { type: Boolean, default: false } 
// }, { timestamps: true });

// module.exports = mongoose.model('User', UserSchema);






const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, "Name is required"] 
  },
  email: { 
    type: String, 
    required: [true, "Email is required"], 
    unique: true 
  },
  password: { 
    type: String, 
    required: [true, "Password is required"]
  },
  role: { 
    type: String, 
    enum: ['user', 'admin'], 
    default: 'user' 
  },
  
  // 🚨 CRITICAL: Banned Status Flag
  isBanned: { type: Boolean, default: false },

  walletBalance: { type: Number, default: 100 },
  
  // Profile Fields
  hourlyRate: { type: Number, default: 20 }, 
  skills: [{ name: String, level: String }], 
  learningInterests: [String], 
  bio: { type: String, default: "" },
  avatar: { type: String },
  
  // Ratings (used in review system)
  rating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },

  isOnboarded: { type: Boolean, default: false } 
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);