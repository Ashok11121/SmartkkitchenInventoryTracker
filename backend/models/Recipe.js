const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  ingredients: [String],
  instructions: String,
  image: String, // URL of the recipe image
  videoUrl: String, // YouTube video URL
  tags: [String],
  time: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // To save per user
});

module.exports = mongoose.model("Recipe", recipeSchema);
