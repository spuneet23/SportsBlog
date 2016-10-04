var express = require('express');
var router = express.Router();

Category = require('../models/Category.js');

/* GET home page. */
router.get('/', function(req, res, next) {
 Category.getCategories(function(err, categories){
     if(err){
     	res.send(err);
     }else {

          res.render('categories', { 
          	title: 'Categories',
          	categories: categories
          	 });
     }
 })
});


// Category Add
router.post('/add', function(req,res){
	req.checkBody('title', 'Title is required').notEmpty();

	var errors = req.validationErrors();
   console.log(errors);
	if(errors){
		res.render('add_category', {
			errors: errors,
			title: "Add Category"
		});
	} else {
		var category = new Category();
		category.title = req.body.title;
		category.description = req.body.desc;

		Category.addCategory( category, function(err,category ){
			if(err) {
				res.send(err);
			} else {
				req.flash('success', 'Category Saved');
				res.redirect('/manage/categories');
			}
		})
	}
});


// Category Edit
router.post('/edit/:id', function(req,res){
	req.checkBody('category_title', 'Title is required').notEmpty();

	var errors = req.validationErrors();
   // console.log("Errors"+errors);
	if(errors){
		res.render('edit_category', {
			errors: errors,
			title: "Edit Category"
		});
	} else {
		// console.log("Hola");
		var category = new Category();
		var query = {_id: [req.params.id]};
		var update = {title: req.body.category_title, description: req.body.category_desc};
        // console.log(update);
		Category.updateCategory(query, update, {}, function(err,category ){
			if(err) {
				res.send(err);
			} else {
				req.flash('success', 'Category Updated');
				res.redirect('/manage/categories');
			}
		})
	}
});


router.delete('/delete/:id', function(req, res){
	var query = {_id: [req.params.id]};
	Category.remove(query, function(err) {
		if(err) {
			res.send(err);
		} else {
			res.status(204).send();
		}
	})
})

module.exports = router;
