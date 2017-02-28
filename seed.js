//RUN this file to seed the database with categories

var mongoose = require("mongoose");
var Category = require("./models/category");
var Item = require("./models/item");
mongoose.connect("mongodb://localhost/shopping_app");

var categories = [ {
    name: "Video Games",
    availability: {
        450331: true,
        500032: true,
        600061: true
    },
    items: [],
    imageUrl: "https://goo.gl/EM0vVB"
}, {
    name: "Television",
    availability: {
        450331: true,
        500032: true,
        600061: true
    },
    items: [],
    imageUrl: "https://goo.gl/Cghj7S"
},{
    name: "Appliances",
    availability: {
        450331: true,
        500032: true,
        600061: true
    },
    items: [],
    imageUrl: "https://goo.gl/mF3sme"
},{
    name: "Furniture",
    availability: {
        450331: true,
        500032: true,
        600025: true
    },
    items: [],
    imageUrl: "https://goo.gl/W8fcxH"
},{
    name: "Mobiles",
    availability: {
        450331: true,
        500032: true,
        600025: true
    },
    items: [],
    imageUrl: "https://goo.gl/uJ7W7D"
}];

categories.forEach(function(category){
    Category.create(category, function(err, category){
        if(err)
            console.log(err);
        else
            console.log(category);
    });
});
