var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var exphbs = require("express-handlebars");

//Axios is similar to Ajax
var axios = require("axios");
var cheerio = require("cheerio");

//Require all models
var db = require("./models");

var PORT = 3000;

//Initialize Express
var app = express();

//Configure middleware

//Use morgan logger for logging request
app.use(logger("dev"));
//Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//Make public a static folder
app.use(express.static("public"));

// Handlebars
app.engine(
    "handlebars",
    exphbs({
      defaultLayout: "main"
    })
  );

  app.set("view engine", "handlebars");

//Connect to the Mongo DB
mongoose.connect("mongodb://localhost/kslScraper", {
    useNewUrlParser: true });

//Routes

//A GET route for scraping the website
app.get("/scrape", function(req, res) {
    axios.get("https://www.ksl.com").then(function(response) {

        
    // axios.get("http://www.echojs.com").then(function(response) {
        var $ = cheerio.load(response.data);
        $("div.headline").each(function(i, element) {
            var result = {};
            // result.title = $(this).parent().text();
            result.link = $(this).find("a").attr("href");
            result.title = $(this).find("a").text();
            result.summary = $(this).find("h5").text();
           

        // $("article h2").each(function(i, element) {

        
            // var result = {};
            // result.title = $(this)
            //     .children("a")
            //     .text();
            // result.link = $(this)
            //     .children("a")
            //     .attr("href");
        db.Article.create(result)
        .then(function(dbArticle) {
            console.log(dbArticle);
        })
        .catch(function(err) {
            console.log(err);
        });
        });
        res.send("Scrape Complete");
    });
});

app.get("/articles", function(req, res) {
    db.Article.find({})
    .then(function(dbArticle) {
        res.json(dbArticle);
    });
});

app.get("/articles/:id", function(req, res) {
    db.Article.findOne({_id: req.params.id})
    .populate("note")
    .then(function(dbArticle) {
        res.json(dbArticle);
    })
    .catch(function(err) {
        res.json(err)
    });
});

app.post("/articles/:id", function(req, res) {
    db.Note.create(req.body)
    .then(function(dbNote) {
        return db.Article.findOneAndUpdate({ _id: req.params.id },
            {note: dbNote._id }, { new: true });
        })
        .then(function(dbArticle) {
            res.json(dbArticle);
        })
        .catch(function(err) {
            res.json(err)
        });
    });

    app.listen(PORT, function() {
        console.log("App running on port " + PORT + "!");
    });


