//here
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

// -- API request to save data to database. Ensure cross-origin requests are allowed
app.options("/store", (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'OPTIONS, POST');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    res.sendStatus(200);
});

app.post("/store", /*cors(),*/ (req, res) => {
    
    // Allow cross-origin requests
    res.set({
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS, POST"
    });

    // If data was sent in the request body, do stuff
    if (req.body.data) {
        // Store hash and date in variables for easy access
        const theCanvasHash = req.body.data.canvas;
        const currentDate = req.body.data.date;
        const originSite = req.headers.origin;

        // Create a new DB entry
        let newEntry = new Analytics({canvasHash: theCanvasHash, lastVisited: currentDate, sites: [originSite]});

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
                                sites: [originSite],
                            });
                        })
                        .catch(err => {
                            console.error("Error in save ", err);
                            return res.status(400).json({
                                success: false,
                                message: err
                            });
                        });
                // If we found an entry, update the last visited time to the current time and update website list
                } else {
                    const lastVisitTime = entry.lastVisited;
                    entry.lastVisited = currentDate;

                    // Add the current website if it isn't already there
                    if (entry.sites.indexOf(originSite) === -1) {
                        entry.sites.push(originSite);
                    }

                    entry.save()
                        .then(() => {
                            return res.status(200).json({
                                success: true,
                                message: "Updated last visit time >:)",
                                lastVisited: lastVisitTime, // Return old value so user knows last time they visited the page
                                sites: entry.sites,
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