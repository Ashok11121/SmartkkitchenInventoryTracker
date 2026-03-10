const express = require('express');
const router = express.Router();
const Item = require('../models/Item');
const auth = require('../middleware/auth'); // Ensure this file exists

// GET User's Inventory
router.get('/', auth, async (req, res) => {
  try {
    // Safety Check:
    if (!req.user || !req.user.id) {
        return res.status(401).json({ msg: 'Authorization denied' });
    }
    
    // Fetch items ONLY for this user
    const items = await Item.find({ owner: req.user.id }).sort({ expiryDate: 1 });
    res.json(items);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// ADD New Item
router.post('/add', auth, async (req, res) => {
  try {
    const newItem = new Item({
      itemName: req.body.itemName,
      expiryDate: req.body.expiryDate,
      quantity: req.body.quantity,
      unit: req.body.unit,
      category: req.body.category, // Save category
      owner: req.user.id // Attach User ID from Token
    });

    const item = await newItem.save();
    res.json(item);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// DELETE Item
router.delete('/:id', auth, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ msg: 'Item not found' });
    }

    // Check user
    if (item.owner.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await item.deleteOne();

    res.json({ msg: 'Item removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Item not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;