// Mongo Setup
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AnalyticsSchema = new Schema({
    canvasHash: {
        type: Number,
        required: true,
        default: 0
    }
    // Add other beacons later for timing and CSS :visited
});

module.exports = Analytics = mongoose.model("analytics", AnalyticsSchema);