require('dotenv').config() // For .env file

const express = require ("express");
const mongoose = require ("mongoose");

const app = express();
const port = 8080;

// Use JSON in requests and use public directory to serve files
app.use(express.static(__dirname + "/public"));
app.use(express.json());

// Mongo
const Analytics = require("./analytics");

const db = process.env.MONGO_URI;
mongoose.set("strictQuery", false);
mongoose.connect(db)
    .then(() => {
        console.log("Mongo Connected");
    })
    .catch(err => {
        console.error(`Mongo Error: ${err}`);
    }); 

// Routes
app.get("/", (req, res) => {
    res.send("index.html");
});

app.post("/store", (req, res) => {

    if (req.body.data) {
        const theCanvasHash = req.body.data.canvas;

        let newEntry = new Analytics({canvasHash: theCanvasHash});

        Analytics.findOne({ canvasHash: theCanvasHash })
            .then(entry => {
                if (entry === null) {
                    newEntry.save()
                        .then(() => {
                            return res.status(200).json({
                                success: true,
                                message: "Logged data to console :)"
                            });
                        })
                        .catch(err => {
                            console.error("Error in save ", err);
                            return res.status(400).json({
                                success: false,
                                message: err
                            });
                        });
                } else {
                    console.error("Error in entry if: Entry exists already");
                    return res.status(400).json({
                        success: false,
                        message: "Entry Exists"
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