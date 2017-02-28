var express = require("express");
var router = express.Router();
var Category = require("../models/category");

//routes retrives all categories an renders the categoreis/index page with them
router.get("/", function(req, res){
    Category.find(function(err, foundCategories){
        if(err){
            console.log(err);
        }else{
            res.render("categories/index", {categories: foundCategories});
        }
    });
});

//Route responds to the check availability request from the individual item page
router.post("/:id/check", function(req, res){
    var pin = Number(req.body.pincode);
    Category.findById(req.params.id, function(err, category){
        if(err){
            console.log("error");
            req.flash("error","Info cant be retrieved");
        } else {
            //checking if provided pincode is in the availability list of category
            if(category.availability[pin]){
                req.flash("success", "Item is available at your location");
                res.redirect("back");
            }
            else{
                req.flash("error", "Item is not available at your location");
                res.redirect("back");
            }
        }
    });
});

module.exports = router;