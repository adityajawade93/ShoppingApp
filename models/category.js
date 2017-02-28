var mongoose = require("mongoose");

var categorySchema = new mongoose.Schema({
    name: String,
    availability: {},
    items: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item"
    }],
    imageUrl: String
});

module.exports = mongoose.model("Category", categorySchema);