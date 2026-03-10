const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  itemName: { type: String, required: true },
  quantity: { type: Number, default: 1 },
  unit: { type: String, default: 'pcs' },
  category: { type: String, default: 'Others' }, // Added category field
  expiryDate: { type: Date, required: true },
  
  // Notification Tracking
  notificationCount: { type: Number, default: 0 },
  lastNotified: { type: Date, default: null },

  // CRITICAL: Links item to specific user
  owner: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  }
});

module.exports = mongoose.model('Item', ItemSchema);