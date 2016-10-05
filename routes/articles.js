var express = require('express');
var router = express.Router();

Article = require('../models/article.js');
/* GET home page. */
router.get('/', function(req, res, next) {
    Article.getArticles(function(err, articles){
    	if(err) {
    		res.send(err);
    	} else {
    		res.render('articles', {
    		 title: 'All Articles' ,
    		 articles: articles
    		});
    	}
    })
  
});


router.get('/show/:id', function(req, res, next) {
  Article.getArticleById([req.params.id], function(err, article){
      if(err) {
      	 res.send(err);
      } else {
      	res.render('article', {
      		 article: article
      		});
      }
  });
});


// Article Add
router.post('/add', function(req,res){
	req.checkBody('title', 'Title is required').notEmpty();
    req.checkBody('author', 'Author Field is required').notEmpty();
    req.checkBody('category', 'Category Field is required').notEmpty();
  
    
	var errors = req.validationErrors();
   console.log(errors);
	if(errors){
    Category.getCategories(function(err, categories){
         res.render('add_article', {
         errors: errors,
         title: "Add Article",
         categories: categories
       });
    });


	} else {
		var article= new Article();
		article.title = req.body.title;
    article.subtitle = req.body.subtitle;
    article.body = req.body.body;
		article.author = req.body.author;

		Article.addArticle( article, function(err,article ){
			if(err) {
				res.send(err);
			} else {
				req.flash('success', 'Article Saved');
				res.redirect('/manage/articles');
			}
		})
	}
});


// Article Edit
router.post('/edit/:id', function(req,res){
  req.checkBody('title', 'Title is required').notEmpty();
  req.checkBody('author', 'Author Field is required').notEmpty();
    req.checkBody('category', 'Category Field is required').notEmpty();

  var errors = req.validationErrors();
   // console.log("Errors"+errors);
  if(errors){
    res.render('edit_article', {
      errors: errors,
      title: req.body.title,
      subtitle: req.body.subtitle,
      body: req.body.body,
      author: req.body.author,
      category: req.body.category
    });
  } else {
    // console.log("Hola");
    var article = new Article();
    var query = {_id: [req.params.id]};
    var update = {
              title: req.body.title,
              subtitle: req.body.subtitle,
              category: req.body.category,
              author: req.body.author
            };
        // console.log(update);
    Article.updateArticle(query, update, {}, function(err,article){
      if(err) {
        res.send(err);
      } else {
        req.flash('success', 'Article Updated');
        res.redirect('/manage/articles');
      }
    })
  }
});


router.get('/category/:category_id', function(req, res, next) {

 Article.getArticles({category:req.params.category_id}, function(err, articles){
     if(err){
      res.send(err);
      console.log(err);
     }else {
      console.log(articles);
          Category.getCategoryById(req.params.category_id, function(err, category){
                res.render('articles', { 
                title: category.title,
                articles: articles
             });
          });

     }
 });
});

router.delete('/delete/:id', function(req, res){
  var query = {_id: [req.params.id]};
  Article.remove(query, function(err) {
    if(err) {
      res.send(err);
    } else {
      res.status(204).send();
    }
  })
})

module.exports = router;
