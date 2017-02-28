var express = require("express");
var router = express.Router();
var User = require("../models/user");
var passport = require("passport");
var Item = require("../models/item");
var Cart = require("../models/cart");
var middleware = require("../middleware/index");
var Order = require("../models/order");
var request = require("request");

router.get("/", function(req, res){
    res.redirect("/categories");
});


//Authentication route

//show register form
router.get("/register", function(req, res) {
    res.render("register");
});

//handle signup form logic
router.post("/register", function(req, res) {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            req.flash("error", err.message);
            return res.render("register");
        }else{
            passport.authenticate("local")(req, res, function(){
                res.redirect("/");
            });
        }
    });
});

//Show login form
router.get("/login", function(req, res){
    res.render("login");
});

//handle login form submit logic
router.post("/login", passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/login",
    }), function(req, res){
});

//handle logout
//logout route
router.get("/logout", function(req, res) {
    req.logout();
    req.session.destroy(function(err){
        if(err){
            console.log(err);
        } else {
            console.log("session destroyed");
        }
    });
    res.redirect("/");
});

//handles the request from cart view to reduce item quantity by 1
router.get('/reduce/:id', function(req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    cart.reduceByOne(productId);
    req.session.cart = cart;
    if(req.session.cart.totalQuantity === 0){
        res.render("cart",{items: null});
    } else {
        res.redirect("/cart");
    }
});

//handles the request to remove the item from cart
router.get('/remove/:id', function(req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    cart.removeItem(productId);
    req.session.cart = cart;
    if(req.session.cart.totalQuantity === 0){
        res.render("cart",{items: null});
    } else {
        res.redirect("/cart");
    }
});



//shopping cart route
//handles the request for adding to cart
router.get("/add-to-cart/:id", middleware.isLoggedIn, function(req, res) {
    var itemId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    
    Item.findById(itemId, function(err, item){
        if(err){
            console.log("error occured");
            res.redirect("/categories");
        }else{
            cart.add(item, itemId);
            req.session.cart = cart;
            res.redirect("/categories");
        }
    });
    
});

//renders the shopping cart
router.get("/cart", middleware.isLoggedIn, function(req, res) {
    if(!req.session.cart){
        res.render("cart",{items: null});
    }
    else{
        var cart = new Cart(req.session.cart);
        res.render("cart", {items: cart.generateArray(), totalPrice: cart.totalPrice});
    }
});

//renders the checkout form
router.get("/checkout", middleware.isLoggedIn, function(req, res) {
    if(!req.session.cart){
        return res.redirect("/cart");
    } else {
        var cart = new Cart(req.session.cart);
        res.render("checkout", {total: cart.totalPrice});
    }
});

//handles checkout with charge creation on stripe and order creation
router.post('/checkout', middleware.isLoggedIn, function(req, res) {
    if (!req.session.cart) {
        return res.redirect('/shopping-cart');
    } 
    
    var cart = new Cart(req.session.cart);
    
    var list = cart.generateArray();
    
    var N_A = "";
    
    var avail = true;
    
    list.forEach(function(item){
        if(!item.item.availability[req.body.pincode]){
            N_A += " " + item.item.name;
            avail = false;
        }
    });
    //check if the selected items are available for the input pincode
    if(avail){
    
        var stripe = require("stripe")(
            "sk_test_saoxBYNZvmcPbLsm2rRFynYA"
        );
    
        stripe.charges.create({
            amount: cart.totalPrice * 100,
            currency: "inr",
            source: req.body.stripeToken, // obtained with Stripe.js
            description: "Test Charge"
        }, function(err, charge) {
            if (err) {
                req.flash('error', err.message);
                return res.redirect('/checkout');
            }
            var order = new Order({
                user: req.user,
                cart: cart,
                address: req.body.city,
                name: req.body.name,
                paymentId: charge.id
            });
            order.save(function(err, result) {
                if(err){
                    req.flash("error","Sorry the order cannot be placed");
                    res.redirect("./categories");
                } else {
                    req.flash('success', 'Successfully bought product!');
                    req.session.cart = null;
                    res.redirect('/categories');
                }
            });
        });
    } else {
        req.flash("error", N_A + " items are not available at your location.");
        res.redirect("/categories");
    }
});

//renders the order page
router.get('/orders', middleware.isLoggedIn, function (req, res, next) {
    Order.find({user: req.user}, function(err, orders) {
        if (err) {
            return res.write('Error!');
        }
        var cart;
        orders.forEach(function(order) {
            cart = new Cart(order.cart);
            order.items = cart.generateArray();
        });
        res.render('orders', { orders: orders });
    });
});

//handles the request for estimated time of delivery
router.get("/orders/:id/items/:item_id", function(req, res) {
    Order.findById(req.params.id, function(err, order){
        if(err){
            console.log(err);
        } else {
            Item.findById(req.params.item_id, function(err, item) {
                if(err){
                    console.log(err);
                }
                else{
                    request("https://maps.googleapis.com/maps/api/distancematrix/json?units=metricl&origins=" + item.vendorLocation + "&destinations="+ order.address +"&key=%20AIzaSyBziyjdv3D8z6Q5fcS_E4LKutrjZw58Jzc", function(error, response, body){
                        if (!error && response.statusCode == 200) {
                            var body = JSON.parse(body);
                            var dist = body.rows[0].elements[0].distance;
                            if(dist){
                                  dist = Math.round(dist.value/1000);
                                  var total_time = Math.round(dist/288);
                                  console.log(total_time);
                                  req.flash("success", "Your Order will reach you in " + total_time + " days." );
                                  res.redirect("back");
                            }
                            else {
                                req.flash("error", "Orders can only be shipped to india" );
                                res.redirect("back");
                            }
                            
                        }
                    });
                }
            });
        }
    });
});

module.exports = router;