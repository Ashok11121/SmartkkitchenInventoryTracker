const express = require('express');
// Polyfill global fetch if not available (should be present in Node 18+)
// This can fix 'fetch failed' on some Windows networks
if (!global.fetch) {
  global.fetch = require('node-fetch');
  global.Headers = require('node-fetch').Headers;
  global.Request = require('node-fetch').Request;
  global.Response = require('node-fetch').Response;
}

const router = express.Router();
const path = require('path');
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

router.post('/', async (req, res) => {
  const { userQuery, inventoryContext } = req.body;
  
  if (!userQuery) {
    return res.status(400).json({ isRecipe: false, reply: "Please provide a query." });
  }

  // Check for API Key
  if (!GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY is missing in .env file");
      return res.json({
          isRecipe: false,
          reply: "System Error: AI API Key is missing. Please check backend configuration."
      });
  }
  
  try {
    // 4. Initialize Gemini with the specific flash version to avoid alias issues
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    // Try the most basic stable model 
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });  

    
    // 2. Define the behavior
    const systemPrompt = `You are ChefBot, a smart kitchen assistant.
    User Inventory: ${inventoryContext || "None"}.
    User Query: "${userQuery}"

    INSTRUCTIONS:
    - You must respond with valid JSON only. Do not add any markdown, explanations, or code blocks.
    - If the user asks for a specific recipe (e.g., "How to make lasagna"), provide that recipe regardless of the user's inventory.
    - If the user asks "What can I make?" or similar, suggest recipes strictly based on the User Inventory.
    - If the user asks for a recipe, output this JSON structure:
    {
      "isRecipe": true,
      "title": "Recipe Name",
      "ingredients": ["Item 1", "Item 2", "Item 3"],
      "instructions": "Step 1... Step 2... Step 3...",
      "time": "30 mins",
      "calories": "500 kcal",
      "youtubeQuery": "how to make Recipe Name"
    }

    - If the user asks a general question (e.g. "Is milk healthy?"), output JSON:
    {
      "isRecipe": false,
      "reply": "Your answer here."
    }

    - If the user says "Hello" or talks about non-food topics, output JSON:
    {
      "isRecipe": false,
      "reply": "I am your AI Chef! Ask me for a recipe or what you can cook with your inventory."
    }`;

    // 3. Generate Content
    const result = await model.generateContent(systemPrompt);

    const response = await result.response;
    let aiText = response.text();
    
    // 4. Clean and Parse Response
    // Remove markdown code blocks if present
    aiText = aiText.replace(/```json/g, '').replace(/```/g, '').trim();

    let parsedResponse;
    try {
        parsedResponse = JSON.parse(aiText);
    } catch (parseError) {
        console.error("JSON Parse Error:", parseError.message);
        console.log("Raw Response was:", aiText);
        // Attempt to recover if it's just raw text
        parsedResponse = { isRecipe: false, reply: aiText };
    }

    // 5. Format Text for Display
    if (parsedResponse.isRecipe) {
        // Create a formatted string for the chat bubble
        const ingredientsList = Array.isArray(parsedResponse.ingredients) 
            ? parsedResponse.ingredients.join(', ') 
            : parsedResponse.ingredients;

        parsedResponse.reply = `**${parsedResponse.title}**\n\n*Time: ${parsedResponse.time} | Calories: ${parsedResponse.calories}*\n\n**Ingredients:**\n${ingredientsList}\n\n**Instructions:**\n${parsedResponse.instructions}`;
    }

    // 6. Send to Frontend
    res.json(parsedResponse);

  } catch (error) {
    console.error("❌ AI Error Details:", error.message);
    
    if (error.message.includes("404") || error.message.includes("not found")) {
        return res.json({
            isRecipe: false,
            reply: "⚠️ AI Connection Error: The selected AI model is not available for your API Key. Please check your Google AI Studio settings or try a different key."
        });
    }

    // --- FALLBACK RESPONSE ---
    res.json({
        isRecipe: false,
        reply: "Sorry, I'm having trouble connecting to the AI chef right now. Please try again later. 🍳"
    });
  }
});

module.exports = router;