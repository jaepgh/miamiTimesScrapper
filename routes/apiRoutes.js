var db = require("../models");
var axios = require("axios");
var cheerio = require("cheerio");
var mongoose = require("mongoose");

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

module.exports = function (app) {

  // Scrape articles
  app.post("/api/scrape", function (req, res) {
    // First, we grab the body of the html with request
    axios.get("http://www.miamitodaynews.com/").then(function (response) {
      // Load the data response into $ for a shorthand selector
      var $ = cheerio.load(response.data);
      var articles = [];

      // Get all the classes card-container items
      $(".featuredpost").each(function (i, element) {
        // Object to be used per article
        var result = {};
        result.url = $(this)
          .children(".posttitle")
          .children("a")
          .attr("href");
        result.date = $(this)
          .children(".postmeta")
          .children(".meta_date")
          .text();
        result.headline = $(this)
          .children(".posttitle")
          .children("a")
          .text();
        result.photo = $(this)
          .children("a")
          .children("img")
          .attr("src");
        result.summary = $(this)
          .children("p").not(".postmeta")
          .text();

        articles.push(result);
      });
      res.json(articles);
    });
  });

  app.post("/api/addArticle", function (req, res) {
    var article = {};

    article.headline = req.body.headline;
    article.url = req.body.url;
    article.date = req.body.date;
    article.photo = req.body.photo;
    article.summary = req.body.summary;

    db.Article.create(article).then(function (dbArticle) {
      return res.json(dbArticle);
    })
      .catch(function (err) {
        return res.json(err);
      });
  });

  app.post("/api/deleteArticle", function (req, res) {
    db.Article.findByIdAndRemove(req.body.id, (err) => {
      if (err)
        return res.status(500).send(err);

      const response = {
        message: "Article successfully deleted",

      };

      return res.status(200).send(response);
    });
  });

  app.post("/api/addComment/:id", function (req, res) {

    db.Comment.create(req.body)
      .then(function (dbComment) {
        db.Article.findOneAndUpdate({ _id: req.params.id }, { $set: { comments: dbComment._id } }, { new: true },
          function (err, doc) {
            res.json(doc);
          })

      })
      .catch(function (err) {
        res.json(err);
      });

  });

  app.post("/api/getComments", function (req, res) {
    db.Article.findOne({ _id: req.body.id })
      .populate("comments")
      .then(function (dbArticle) {
        res.json(dbArticle);
      })
      .catch(function (err) {
        res.json(err);
      });
  });

  app.post("/api/deleteComments", function (req, res) {
    db.Comment.findOneAndRemove({ _id: req.body.id }, function (err, doc) {
      res.json(doc);
    });
  });
};



