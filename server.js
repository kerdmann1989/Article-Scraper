var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var exphbs = require("express-handlebars");

//Axios is similar to Ajax
var axios = require("axios");
var cheerio = require("cheerio");

//Require all models
var db = require("./models");

var PORT = process.env.PORT || 3000;

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/kslScraper";

mongoose.connect(MONGODB_URI);

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
    //   partialsDir: path.join(__dirname, "/views/layouts/partials")

    })
  );

app.set("view engine", "handlebars");
//Connect to the Mongo DB
// mongoose.connect("mongodb://localhost/kslScraper", {
//     useNewUrlParser: true });


//Routes

//A GET route for scraping the website
// app.get("/", function(req, res) {
    
//     res.render("index")
// })
// app.get("/", function(req, res) {
//     db.Article.find({"saved": false}, function(error, data) {
//       var hbsObject = {
//         article: data
//       };
//       console.log("THIS IS IT", hbsObject);
//       res.render("index", hbsObject);
//     });
//   });

  app.get("/", (req, res) => {
    db.Article.find({})
        .then(function (dbArticle) {
            // If we were able to successfully find Articles, send them back to the client
            const retrievedArticles = dbArticle;
            let hbsObject;
            hbsObject = {
                articles: dbArticle
            };
            res.render("index", hbsObject);        
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});

app.get("/scrape", function(req, res) {
    axios.get("https://www.ksl.com").then(function(response) {
   
        var $ = cheerio.load(response.data);
        $("div.headline").each(function(i, element) {
            var result = {};
            // result.title = $(this).parent().text();
            result.link = $(this).find("a").attr("href");
            result.title = $(this).find("a").text();
            result.summary = $(this).find("h5").text();
           
        db.Article.create(result)
        .then(function(dbArticle) {
            // console.log("This is dbArticle", dbArticle);
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
