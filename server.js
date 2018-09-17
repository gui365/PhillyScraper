var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var axios = require("axios");
var db = require("./models");
var cheerio = require("cheerio");
var exphbs = require("express-handlebars");

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

var PORT = 3000;

var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Handlebars
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main"
  })
);
app.set("view engine", "handlebars");

// Mongoose
mongoose.connect("mongodb://localhost/phillyscraperdb", { useNewUrlParser: true });

app.get("/", function(req, res) {
  res.render("index");
})

app.get("/scrape", function(req, res) {
  var results = {articles: []};
  
  axios.get("https://www.uwishunu.com/").then(function(response) {
    var $ = cheerio.load(response.data);
    
    $("#latest-posts article").each(function(i, element) {
      // console.log(element);
      
      var result = {};
      var title = $(element).find(".entry-title").find("a").text();
      var link = $(element).find(".entry-title").find("a").attr("href");
      var description = $(element).find(".entry-content p").text();
      var picture = $(element).find(".featured-image-as-background").attr("style");

      if (title && link && description && picture) {
        result.title = title;
        result.link = link;
        result.description = description;
        result.picture = picture;
        results.articles.push(result);
        
        db.Article.create(result).then(function(article) {
            console.log(article);
          })
          .catch(function(err) {
            return res.json(err);
          });
      } else {
        console.log("Incomplete entry");
      };

    });

    // console.log(results);
    
  }).then(function(loadedArticles) {
    res.render("index", results);
  });
  
});

app.listen(PORT, function() {
  console.log("App running on port " + PORT);
});