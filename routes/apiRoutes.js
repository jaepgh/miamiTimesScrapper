var db = require("../models");
var axios = require("axios");
var cheerio = require("cheerio");

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
    res.json({});
  });
};



