const path = require('path');
const fs = require('fs');
require('dotenv').config();

const API_KEY = process.env.GEMINI_API_KEY;

console.log("Checking Gemini API Key...");
if (!API_KEY) {
    console.error("❌ GEMINI_API_KEY is missing in .env file!");
} else {
    console.log("✅ GEMINI_API_KEY found (length: " + API_KEY.length + ")");
    console.log("First 5 chars: " + API_KEY.substring(0, 5));
    
    // Simple test call
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;
        
    fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: "Hello, confirm you are working." }] }] })
    })
    .then(async res => {
        if (!res.ok) {
            console.error(`❌ API Request Failed: ${res.status} ${res.statusText}`);
            console.error(await res.text());
        } else {
            const data = await res.json();
            console.log("✅ API Connectivity Successful!");
            console.log("Response:", data.candidates[0].content.parts[0].text);
        }
    })
    .catch(err => {
        console.error("❌ Connectivity Error:", err.message);
    });
}
