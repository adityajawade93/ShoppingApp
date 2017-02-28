//Importing the dependencies
var express         = require("express"),
    mongoose        = require("mongoose"),
    bodyParser      = require("body-parser"),
    cookieParser    = require("cookie-parser"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    session         = require("express-session"),
    MongoStore      = require("connect-mongo")(session),
    flash           = require("connect-flash"),
    validator       = require("express-validator"),
    //routes
    Item            = require("./models/item"),
    indexRoutes     = require("./routes/index"),
    categoryRoutes  = require("./routes/category"),
    itemRoutes      = require("./routes/item"),
    //models
    User            = require("./models/user");
    
var app = express();

//configuring the app
mongoose.connect("mongodb://localhost/shopping_app");
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

//turning session on
app.use(session({
    secret: "this is good task",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    cookie: { maxAge: 180 * 60 * 1000 }
}));

//installing flash messages
app.use(flash());

//configuring passport
passport.use(new LocalStrategy(User.authenticate()));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//middle ware to set all the global app variables
app.use(function(req ,res, next){
    res.locals.currentUser = req.user;
    res.locals.session = req.session;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

//routes
app.use("/", indexRoutes);
app.use("/categories", categoryRoutes);
app.use("/categories/:id/items", itemRoutes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


//server start
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server Started......");
});
