var mongoose = require("mongoose");

var itemSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    vendorLocation: String,
    imageUrl: String,
    availability: {}
});

module.exports = mongoose.model("Item", itemSchema);