const cron = require('node-cron');
const Item = require('../models/Item');
const twilio = require('twilio');

// Load env variables (Ensure dotenv is loaded in server.js)
const accountSid = process.env.TWILIO_ACCOUNT_SID; 
const authToken = process.env.TWILIO_AUTH_TOKEN; 
const client = accountSid && authToken ? require('twilio')(accountSid, authToken) : null;
const TWILIO_PHONE = process.env.TWILIO_PHONE_NUMBER; 

const checkExpiryAndNotify = async () => {
    // Silent Mode: Removed console.log('⏰ [Scheduler] Checking...')
    if (!client) {
      // console.warn("⚠️ Twilio client not initialized. Check TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN in .env");
      return;
    }
  
    try {
      const today = new Date();
      // Reset time to start of day for accurate comparison
      today.setHours(0, 0, 0, 0); 
  
      const twoDaysFromNow = new Date(today);
      twoDaysFromNow.setDate(today.getDate() + 2);
      twoDaysFromNow.setHours(23, 59, 59, 999); 
  
      // Fetch items that are expiring soon AND haven't been notified >3 times
      const expiringItems = await Item.find({
        expiryDate: { $gte: today, $lte: twoDaysFromNow },
        // notificationCount: { $lt: 3 }, // Limit to 3 notifications (Commented out to test)
      }).populate('owner');
  
      if (expiringItems.length > 0) {
        // console.log(`found ${expiringItems.length} items`);
        
        for (const item of expiringItems) {
          if (!item.owner || !item.owner.mobile) continue;

          // Check if recently notified (within last 24 hours to avoid spamming every 10 mins)
          const lastSent = item.lastNotified ? new Date(item.lastNotified) : null;
          const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  
          if (lastSent && lastSent > twentyFourHoursAgo) {
              continue;
          }
  
          const message = `Alert: Your ${item.itemName} is expiring on ${new Date(item.expiryDate).toDateString()}!`;
              
          // Format phone number: Ensure it starts with + (Default to +91 for India if missing)
          let phone = item.owner.mobile;
          if (!phone.startsWith('+')) {
                // If it's a 10 digit number, assume +91. 
                // Adjust this logic if you expect other country codes
                phone = '+91' + phone; 
          }
  
          if (client && TWILIO_PHONE) {
                  try {
                      await client.messages.create({
                          body: message,
                          to: phone, 
                          from: TWILIO_PHONE
                      });
                      console.log(`SMS Sent: "${item.itemName}" to ${phone}`);
                      
                      // Update Item Notification Status
                      item.notificationCount = (item.notificationCount || 0) + 1;
                      item.lastNotified = new Date();
                      await item.save();
  
                  } catch (smsError) {
                      console.error(`❌ SMS Failed for ${phone}:`, smsError.message);
                  }
          }
        }
      }
    } catch (error) {
      console.error("Scheduler Error:", error.message);
    }
  };

const startScheduler = () => {
  // Run every hour to check (reduced frequency from 10 mins to avoid high load)
  cron.schedule('0 * * * *', checkExpiryAndNotify);
  // Silent: Removed startup log
};

module.exports = startScheduler;