const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const compression = require('compression'); // Import compression
const cron = require('node-cron');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Models
const Item = require('./models/Item');
const User = require('./models/User');
const Product = require('./models/Product');
const startScheduler = require('./services/smsScheduler');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());
app.use(compression()); // Use compression

// --- ROUTES ---
try {
  const itemRoutes = require('./routes/itemRoutes');
  const authRoutes = require('./routes/AuthRoutes');
  const chatRoutes = require('./routes/chatRoutes');

  app.use('/api/items', itemRoutes);
  app.use('/api/auth', authRoutes);
  app.use('/api/chat', chatRoutes);
} catch (e) { console.error("Route Error:", e.message); }

// --- IMAGE MAPPER (Assigns images based on keywords) ---
const getImageForProduct = (name, category) => {
  const n = name.toLowerCase();
  if (n.includes('onion')) return 'https://images.unsplash.com/photo-1508747703703-06f5051b517f?auto=format&fit=crop&w=500&q=80';
  if (n.includes('potato')) return 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=500&q=80';
  if (n.includes('tomato')) return 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=500&q=80';
  if (n.includes('oil')) return 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=500&q=80';
  if (n.includes('rice')) return 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=500&q=80';
  if (n.includes('milk')) return 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=500&q=80';
  if (n.includes('chocolate')) return 'https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&w=500&q=80';
  if (n.includes('chicken')) return 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=500&q=80';
  if (n.includes('tea')) return 'https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?auto=format&fit=crop&w=500&q=80';
  if (n.includes('paneer')) return 'https://images.unsplash.com/photo-1631451095765-2c91616fc9e6?auto=format&fit=crop&w=500&q=80';
  if (n.includes('apple')) return 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=500&q=80';
  
  // Default based on Category
  if (category === 'Vegetables') return 'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?auto=format&fit=crop&w=500&q=80';
  if (category === 'Fruits') return 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=500&q=80';
  if (category === 'Dairy') return 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=500&q=80';
  if (category === 'Grains') return 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=500&q=80';
  
  return 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80'; // Generic Grocery
};
app.get("/api/products", async (req, res) => {
    const products = await Product.find();
    res.json(products);
});

// --- SMS SCHEDULER ---
// startScheduler();  // Moved to database connection success block

async function importData() {
    try {
        const data = JSON.parse(
            fs.readFileSync("./data/smartkitchen_real_images.json", "utf-8")
        );

        await Product.deleteMany(); // optional
        await Product.insertMany(data);
        console.log("Grocery Data Imported Successfully");
    } catch (error) {
        console.error(error);
    }
}

/* ----------- UNCOMMENT ONLY FIRST TIME ----------- */
// importData();


// --- START SERVER ---
// Using 127.0.0.1 fixes "buffering timed out" errors on some systems where localhost resolves to IPv6
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/smart_kitchen_db', {
  serverSelectionTimeoutMS: 5000 // Timeout after 5s instead of hanging
})
  .then(() => {
    console.log('MongoDB Connected');
    // Start SMS Scheduler
    startScheduler(); 
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('MongoDB Connection Error:', err);
    console.log('TIP: Is your MongoDB service running? Try searching "Services" in Windows and starting MongoDB.');
  });