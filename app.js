const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB");

const articleSchema = {
  title: String,
  content: String
};

const Article = mongoose.model("Article", articleSchema);

app.get("/articles", function(req, res){
  Article.find({}).then(function(foundArticles){
    console.log(foundArticles);
    res.send(foundArticles);
  })
  .catch(function(err){
    console.log(err)
  })
});

app.post("/articles", function(req, res){
  console.log(req.body.title)
  console.log(req.body.content)

  const newArticle = new Article({
    title: req.body.title,
    content: req.body.content
  });

  newArticle.save();
});

app.listen(3000, function(){
  console.log("Server started on port 3000");
});