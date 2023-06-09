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

// Requests All Articles
app.route("/articles")

.get(function(req, res){
  Article.find({}).then(function(foundArticles){
    console.log(foundArticles);
    res.send(foundArticles);
  })
  .catch(function(err){
    console.log(err)
    res.send(err)
  })
})

.post(function(req, res){
  console.log(req.body.title)
  console.log(req.body.content)
  
  const newArticle = new Article({
    title: req.body.title,
    content: req.body.content
  });
  
  newArticle.save();
})

.delete(function(req, res){
  Article.deleteMany({}).then(function(){
    res.send("Successfully deleted all articles.")
  })
  .catch(function(err){
    res.send(err)
  })
});

// Requests All Articles
app.route("/articles/:articleTitle")

.get(function(req, res){

  Article.findOne({title: req.params.articleTitle}).then(function(foundArticles){
    console.log(foundArticles);
    res.send(foundArticles);
  })
  .catch(function(err){
    console.log(err)
    res.send("No articles matching that title was found.")
  })
})

.put(function(req, res){

  Article.replaceOne(
    {title: req.params.articleTitle}, 
    {title: req.body.title, content: req.body.content},
    {overwrite: true})
  .then(function(){
    res.send("Successfully updated article.");
  })
  .catch(function(err){
    console.log(err)
    res.send(err)
  })
})

.patch(function(req, res){
  Article.updateOne(
    {title: req.params.articleTitle}, 
    {$set: req.body})
  .then(function(){
    res.send("Successfully updated article.");
  })
  .catch(function(err){
    console.log(err)
    res.send(err)
  })
})

.delete(function(req, res){
  Article.deleteOne(
    {title: req.params.articleTitle})
  .then(function(){
    res.send("Successfully deleted the corresponding article.")
  })
  .catch(function(err){
    console.log(err)
    res.send(err)
  })
})

app.listen(3000, function(){
  console.log("Server started on port 3000");
});