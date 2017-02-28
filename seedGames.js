//run this to seed the videogame categories with data

var mongoose = require("mongoose");
var Category = require("./models/category");
var Item = require("./models/item");
mongoose.connect("mongodb://localhost/shopping_app");

var games = [ {
    name: "Witcher 3 : The Wild Hunt",
    description: "The Witcher® 3: Wild Hunt is a story-driven, next-generation open world role-playing game, set in a visually stunning fantasy universe, full of meaningful choices and impactful consequences. You play as Geralt of Rivia, a monster hunter tasked with finding a child from an ancient prophecy.",
    price: 2400,
    vendorLocation: "Pune",
    imageUrl: "https://goo.gl/ZRJFvW"
},{
    name: "NFL",
    description: "The Witcher® 3: Wild Hunt is a story-driven, next-generation open world role-playing game, set in a visually stunning fantasy universe, full of meaningful choices and impactful consequences. You play as Geralt of Rivia, a monster hunter tasked with finding a child from an ancient prophecy.",
    price: 1600,
    vendorLocation: "Delhi",
    imageUrl: "https://goo.gl/5qTtms"
},{
    name: "CS:GO",
    description: "The Witcher® 3: Wild Hunt is a story-driven, next-generation open world role-playing game, set in a visually stunning fantasy universe, full of meaningful choices and impactful consequences. You play as Geralt of Rivia, a monster hunter tasked with finding a child from an ancient prophecy.",
    price: 3500,
    vendorLocation: "Pune",
    imageUrl: "https://goo.gl/QO4SLx"
},{
    name: "Halo 3",
    description: "The Witcher® 3: Wild Hunt is a story-driven, next-generation open world role-playing game, set in a visually stunning fantasy universe, full of meaningful choices and impactful consequences. You play as Geralt of Rivia, a monster hunter tasked with finding a child from an ancient prophecy.",
    price: 1200,
    vendorLocation: "Chennai",
    imageUrl: "https://goo.gl/7nZhG5"
},{
    name: "Uncharted 4",
    description: "The Witcher® 3: Wild Hunt is a story-driven, next-generation open world role-playing game, set in a visually stunning fantasy universe, full of meaningful choices and impactful consequences. You play as Geralt of Rivia, a monster hunter tasked with finding a child from an ancient prophecy.",
    price: 1400,
    vendorLocation: "Indore",
    imageUrl: "https://goo.gl/EM0vVB"
}];

games.forEach(function(game){
    Category.findOne({name: "Video Games"}, function(err, category){
    if(err)
        console.log(err);
    else{
            Item.create(game, function(err, item){
                if(err){
                    console.log(err);
                }else{
                    item.availability = category.availability;
                    item.save(function(err, item){
                        if(err)
                            console.log(err);
                        category.items.push(item);
                        category.save();
                    });
                    
                    console.log(item);
                }    
            });
       
         }    
    }); 
});
