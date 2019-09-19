//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/WikiDB", {useNewUrlParser: true});

const articleSchema = {
  title: String,
  content: String
};

const Article = mongoose.model("Article", articleSchema);

//////////////////////Requests targeting all articles///////////
app.route("/articles")
  .get(function(req,res){

    Article.find(function(err,foundArticles){
      console.log(foundArticles);
      if(!err){
        res.send(foundArticles);
      }else{
        res.send(err);
      }
    });
  })
  .post(function(req,res){
    console.log(req.body.title);
    console.log(req.body.content);
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content
    });
    newArticle.save(function(err){
      if(!err){
        res.send("Successfully Posted new Entry");
      }else{
        res.send(err);
      }
    });
  })
  .delete(function(req,res){
    Article.deleteMany(function(err){
      if(!err){
        res.send("Successfully Deleted All items");
      }else{
        res.send(err);
      }
    });
  });

//////////////////////Requests targeting selected articles///////////
  app.route("/articles/:articleTitle")
    .get(function(req,res){

      Article.findOne({title: req.params.articleTitle}, function(err,foundArticle){
        console.log(foundArticle);
        if(foundArticle){
          res.send(foundArticle);
        }else{
          res.send("No articles Found matching URL");
        }
      });
    })
    .put(function(req,res){

      Article.update(
        {title: req.params.articleTitle},
        {title: req.body.title, content: req.body.content},
        {overwrite: true},
        function(err){
          if(!err){
            res.send("Successfully updated Item");
          }
        });
    })
    .patch(function(req,res){

      Article.update(
        {title: req.params.articleTitle},
        {$set: req.body},
        function(err){
          if(!err){
            res.send("Successfully Patched Item");
          }
        });
    }).delete(function(req,res){

      Article.deleteOne({title: req.params.articleTitle},function(err){
        if(!err){
          res.send("Successfully deleted item");
        }
      });
    });


app.listen(4000, function() {
  console.log("Server started on port 4000");
});
