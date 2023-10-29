// Set up Express server
const express = require('express');
const app = express();
app.use(express.json());

// DB 1 - How to connect to the MongoDB
const { Database } = require("quickmongo");
const db = new Database("mongodb+srv://audiopants:n7GPvGOuoJkYoEPC@cluster0.jhh3kno.mongodb.net/?retryWrites=true&w=majority");

// Define an async function to connect to the database
async function connectToDatabase() {
    try {
        await db.connect();
        console.log("Connected to the database");
    } catch (error) {
        console.error("Error connecting to the database:", error);
    }
}

// Call the async function to connect to the database
connectToDatabase()
    .then(() => {
        app.use(express.static('public')); // Serve static files from 'public' directory

        // Route to save favorite color
        app.post('/save-color', async (req, res) => {
            try {
                let color = req.body.color;

                // Add color to the database
                await db.push("favoriteColors", color);
                res.json({ task: 'success' });
            } catch (error) {
                console.error("Error saving favorite color:", error);
                res.status(500).json({ error: "Internal Server Error" });
            }
        });

        // Start the server on port 5000 after connecting to the database
        app.listen(5000, () => {
            console.log('Listening at localhost:5000');
        });

        // Route to get all favorite colors
        app.get('/get-colors', async (req, res) => {
            try {
                const favoriteColors = await db.get("favoriteColors") || [];
                res.json({ data: favoriteColors });
            } catch (error) {
                console.error("Error fetching favorite colors:", error);
                res.status(500).json({ error: "Internal Server Error" });
            }
        });
    })
    .catch((error) => {
        console.error("Error starting the server:", error);
    });
