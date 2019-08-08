let app = new (require('express').Router)();
const models = require('../models');


app.get('/',(req,res,next)=>{
	//Создадим новый handler который сидит по пути `/`
	models.Post.find({}).exec().then((posts)=>{

		res.json(posts);
		// Отправим рендер образа под именем index
	}).catch(next);
});

module.exports = app;
