const express = require('express');
const router = express.Router();
const { db } = require('../firebase');
// Import Google Gen AI Architecture SDK
const { GoogleGenAI } = require('@google/genai');

// Initialize the API with our environment key securely
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// POST /api/recommendations/vibe
// Generates expert movie/show recommendations based on a "vibe" via AI Pipeline bridging Firestore Cache
router.post('/vibe', async (req, res) => {
    try {
        const { vibe } = req.body;
        
        // 1. EXTRACT & VALIDATE
        if (!vibe || typeof vibe !== 'string') {
            return res.status(400).json({ error: 'A valid "vibe" string block is physically required.' });
        }

        // 2. SLUGIFY for the Caching Identifier Key (e.g. "Sci-Fi Anime" -> "sci-fi-anime")
        const slugifiedVibe = vibe.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

        // 3. CACHE CHECK: Query the Firestore Database First
        console.log(`[AI Engine] Intercepting req... Checking cache for vibe: ${slugifiedVibe}`);
        const docRef = db.collection('recommendations').doc(slugifiedVibe);
        const docSnap = await docRef.get();

        if (docSnap.exists) {
            // CACHE HIT: Found existing data. Short-circuit execution and return.
            // Protects API quota substantially.
            console.log(`[AI Engine] Served from Cache: ${slugifiedVibe}`);
            return res.status(200).json({ 
                success: true, 
                cached: true,
                data: docSnap.data().items 
            });
        }

        // 4. CACHE MISS (Fallback to Gemini Initialization)
        console.log(`[AI Engine] Cache Miss. Invoking Gemini API for vibe string: ${vibe}`);
        
        // PROMPT INJECTION: Highly restrictive rules for structured JSON formatting
        const prompt = `Act as an expert film and television curator. Recommend exactly 5 highly-rated ${vibe} movies/shows. Return ONLY a valid JSON array of objects. Each object must contain 'title', 'release_year', 'genre', 'description', and 'tmdb_search_query'. Do not use markdown blocks or any other formatting, just pure JSON array output.`;

        // Direct async call onto flash models
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        const textResponse = response.text;

        // 5. PARSE RESPONSE
        let parsedData;
        try {
            // Aggressive sanitization logic to clean AI-injected markdown code blocks if the prompt constraint fails
            const cleanedJsonString = textResponse.replace(/^```json/g, '').replace(/^```/g, '').replace(/```$/g, '').trim();
            parsedData = JSON.parse(cleanedJsonString);
        } catch (parseError) {
            console.error('[AI Engine] Failed to parse JSON from Gemini:', textResponse);
            return res.status(500).json({ error: 'AI Generation Syntax formatting issue. Try requesting again.' });
        }

        // 6. SAVE TO DB: Store the results against the slugified ID for future user pooling
        await docRef.set({
            vibe: vibe,
            createdAt: new Date().toISOString(),
            items: parsedData
        });

        // 7. RETURN: Respond exactly with the constructed array to the client
        console.log(`[AI Engine] API Generated & successfully cached footprint for: ${slugifiedVibe}`);
        return res.status(200).json({ 
            success: true, 
            cached: false,
            data: parsedData 
        });

    } catch (error) {
        // Broad capture for SDK and DB timeouts
        console.error('[AI Engine] Critical Routing Error:', error);
        res.status(500).json({ error: error.message || 'Internal Server Code Error.' });
    }
});

module.exports = router;
