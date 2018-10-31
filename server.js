var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
require('handlebars');
var expressHandlebars = require("express-handlebars")
require('dotenv').config();

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = process.env.PORT || 3000;

// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("static"));

// connecting handlebars to the app
app.engine("handlebars", expressHandlebars({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/Unit18Homework";

// Connects to the database and collection, named as Unit18Homework
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

// Scrapes the Washington Post for it's main page headers
app.get("/scrape", function(req, res) {
    // First, we grab the body of the html with axios
    axios.get("https://www.washingtonpost.com/").then(function(response) {
      // Then, we load that into cheerio and save it to $ for a shorthand selector
      var $ = cheerio.load(response.data);
  
      // Now, we grab every h2 within an article tag, and do the following:
      $(".headline", "div").each(function(i, element) {
        // Save an empty result object
        var result = {};
  
        // Add the text and href of every link, and save them as properties of the result object
        result.title = $(this)
          .children("a")
          .text();
        result.link = $(this)
          .children("a")
          .attr("href");
  
        // Create a new Article using the `result` object built from scraping
        db.Article.create(result)
          .then(function(dbArticle) {
            // View the added result in the console
            console.log(dbArticle);
          })
          .catch(function(err) {
            // If an error occurred, send it to the client
            return res.json(err);
          });
      });
  
      // If we were able to successfully scrape and save an Article, send a message to the client
      res.redirect("/");
    });
  });

// Route for getting all Articles from the db
app.get("/", function (req, res) {
    // Grab every document in the Articles collection
    db.Article.find({})
    .limit(10)
        .then(function (dbArticle) {
            // If we were able to successfully find Articles, send them back to the client
            // res.json(dbArticle);
            res.render("home", {articles: dbArticle});
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});

// Route for showing all the articles in JSON format 
app.get("/articles", function (req, res) {
  // Grab every document in the Articles collection
  db.Article.find({})
      .then(function (dbArticle) {
          // If we were able to successfully find Articles, send them back to the client
          res.json(dbArticle);
      })
      .catch(function (err) {
          // If an error occurred, send it to the client
          res.json(err);
      });
});

// Route to clear the Article collection in the database
app.get("/clearArticles", function(req, res) {
  db.Article.remove({}, () => {});
})

app.post("/addNote", function(req, res) {
  
  db.Note.create(req.body).then(function(dbNote) {
    res.json(dbNote);
  });
  
});

app.get("/note:id", function (req, res) {
  let id = req.param.id

  db.Note.where({id}).find({})
  .then( function (savedArticles) {
    res.json(savedArticles);
    res.render("saved", {savedArticles: savedArticles});
  })
  .catch((err) => {
    res.json(err)
  }) 
});

app.get("/api/saved", function (req, res) {
  db.Note.find({})
    .then( function (dbNote) {
      res.json(dbNote);
    })
    .catch(function(err){
      res.json(err)
    })
})


// Listens for the application to be running.
app.listen(PORT, function () {
    console.log(`Listening on port: ${PORT}`)
})