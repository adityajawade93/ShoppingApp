var express = require("express");
var router = express.Router({mergeParams: true});
var Category = require("../models/category");
var Item = require("../models/item");


//index route for item to display
router.get("/",function(req, res){
    Category.findById(req.params.id).populate("items").exec(function(err, category){
        if(err){
            console.log(err);
        }else{
            res.render("items/index", {category: category});
        }
    });
});

//render the page for one single item
router.get("/:item_id", function(req, res){
    Item.findById(req.params.item_id, function(err, item){
        if(err){
            req.flash("error", "Requested Item not found");
            res.redirect("/categories");
        } else {
            res.render("items/show", {item: item, categoryId: req.params.id});
        }
    });
});

module.exports = router;