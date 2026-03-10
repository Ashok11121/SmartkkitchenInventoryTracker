import cron from "node-cron";
import Item from "../models/Item.js";
import User from "../models/User.js";

// Run this check every day at 9:00 AM
// Cron syntax: "0 9 * * *" (Minute 0, Hour 9)
export const startExpiryScheduler = () => {
  cron.schedule("0 9 * * *", async () => {
    console.log("⏰ Running daily expiry check...");
    
    const today = new Date();
    const threeDaysLater = new Date();
    threeDaysLater.setDate(today.getDate() + 3);

    try {
      // Find items expiring strictly between today and 3 days from now
      const expiringItems = await Item.find({
        expiryDate: { 
            $gte: today, 
            $lte: threeDaysLater 
        }
      });

      if (expiringItems.length > 0) {
        // In a real app, you would loop through users to find who owns which item.
        // For this simple version, we will alert ALL registered users.
        const users = await User.find();
        
        users.forEach(user => {
            console.log(`\n📢 [SMS ALERT to ${user.phoneNumber}]: Hello ${user.fullName}, warning! Some items in your kitchen are expiring soon!`);
            // HERE is where you would call the Twilio API to send a real SMS
        });
      }
    } catch (error) {
      console.error("Scheduler Error:", error);
    }
  });
};