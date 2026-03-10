const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: String,
    category: String,
    sub_category: String,
    brand: String,
    price: Number,
    mrp: Number,
    type: String,
    rating: Number,
    description: String,
    image_url: String
});

module.exports = mongoose.model("Product", productSchema);
