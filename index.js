require('dotenv').config() // For .env file

const express = require ("express");
const mongoose = require ("mongoose");

const app = express();
const port = 8080;

// Use JSON in requests and use public directory to serve files
app.use(express.static(__dirname + "/public"));
app.use(express.json()); // super important line

// Mongo
const Analytics = require("./analytics");

const db = process.env.MONGO_URI; // Get the connection url from the file ".env"
mongoose.set("strictQuery", false);
mongoose.connect(db)
    .then(() => {
        console.log("Mongo Connected");
    })
    .catch(err => {
        console.error(`Mongo Error: ${err}`);
    }); 

// Routes
// -- Serve the homepage
app.get("/", (req, res) => {
    res.send("index.html");
});

// -- API request to save data to database
app.post("/store", (req, res) => {

    // If data was sent in the request body, do stuff
    if (req.body.data) {

        // Allow queries from anywhere
        res.setHeader("Access-Control-Allow-Origin", req.headers.origin);

        // Store hash and date in variables for easy access
        const theCanvasHash = req.body.data.canvas;
        const currentDate = req.body.data.date;

        // Create a new DB entry
        let newEntry = new Analytics({canvasHash: theCanvasHash, lastVisited: currentDate});

        Analytics.findOne({ canvasHash: theCanvasHash })
            .then(entry => {
                // If we couldn't find an entry, add one
                if (entry === null) {
                    newEntry.save()
                        .then(() => {
                            return res.status(200).json({
                                success: true,
                                message: "Saved to DB >:)",
                                lastVisited: currentDate,
                            });
                        })
                        .catch(err => {
                            console.error("Error in save ", err);
                            return res.status(400).json({
                                success: false,
                                message: err
                            });
                        });
                // If we found an entry, update the last visited time to the current time
                } else {
                    const lastVisitTime = entry.lastVisited;
                    entry.lastVisited = currentDate;
                    entry.save()
                        .then(() => {
                            return res.status(200).json({
                                success: true,
                                message: "Updated last visit time >:)",
                                lastVisited: lastVisitTime // Return old value so user knows last time they visited the page
                            });
                        })
                        .catch(err => {
                            console.error("Error in save ", err);
                            return res.status(400).json({
                                success: false,
                                message: err
                            });
                        });
                }
            })
            .catch(err => {
                console.error("Error in findOne ", err);
                return res.status(400).json({
                    success: false,
                    message: err
                });
            });
    } else {
        // Do this if there was a bad request (no data provided)
        console.error("Error in request");
        return res.status(400).json({
            success: false,
            message: "Failed to log data :,("
        });
    }
});



app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});