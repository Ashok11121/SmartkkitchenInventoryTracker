const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

async function testGemini() {
    console.log("Testing Gemini API...");
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
        console.error("❌ No API Key found in .env");
        return;
    }
    console.log("Key found:", key.substring(0, 5) + "...");

    const genAI = new GoogleGenerativeAI(key);
    
    // Models to test
    const models = ["gemini-2.5-flash", "gemini-flash-latest"];

    for (const modelName of models) {
        console.log(`\nAttempting model: ${modelName}`);
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const prompt = "Hello, are you working?";
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            console.log(`✅ Success with ${modelName}:`, text);
            return; // Exit on first success
        } catch (error) {
            console.error(`❌ Failed with ${modelName}:`);
            console.error("   Error Name:", error.name);
            console.error("   Error Message:", error.message);
            // Log full details if avail
            if (error.response) {
                console.error("   API Status:", error.response.status);
            }
        }
    }
}

testGemini();
