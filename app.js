const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app =express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));



mongoose.connect("mongodb://127.0.0.1:27017/wikiDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});


const articleSchema = {
  title:String,
  content:String
};

const Article = mongoose.model("Article",articleSchema);


//request targetting all articles
app.route("/articles")
.get(function(req,res){
  Article.find(function(err,foundList){
  if(!err){
    res.send(foundList);
  }
  else{
    console.log(err);
  }
});
})
.post(function(req,res){
  const title = req.body.title;
  const content = req.body.content;

  const article = new Article({
    title:title,
    content:content
  });

article.save(function(err){
  if(!err){
    res.send("Successfully saved to the database");
  }
  else{
    res.send(err);
  }
})
})
.delete(function(req,res){
  Article.deleteMany(function(err){
    if(!err){
      res.send("Successfully deleted the documents");
    }
    else{
      res.send(err);
    }
  })
});

//request targetting specific articles
app.route("/articles/:articleTitle")
.get(function(req,res){
  Article.findOne({title:req.params.articleTitle},function(foundArticle,err){
    if(!err){
      res.send(foundArticle)
    }
    else
    {
      res.send(err)
    }
  })
})
.put(function(req,res){
  Article.replaceOne({title:req.params.articleTitle},
    {title:req.body.title,content:req.body.content},
    {overwrite:true},function(err){
    if(!err){
      res.send("Successfully updated the article")
    }
    else{
      res.send(err)
      console.log(err);
    }
  })
})
.patch(function(req,res){
  Article.updateOne({title:req.params.articleTitle},
  {$set:req.body},
  function(err){
    if(!err){
      res.send("Successfully updated the article")
    }
    else{
      res.send(err)
    }
  })
})
.delete(function(req,res){
  Article.deleteOne({title:req.params.articleTitle},
  function(err){
    if(!err){
      res.send("Successfully deleted the article")
    }
    else{
      res.send(err)
    }
  })
});





app.listen(3000,function(){
  console.log("Listening on port 3000");
});
