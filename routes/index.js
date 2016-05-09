var express = require('express');
var router = express.Router();

var db = require('../db');

var collection_name = "oxlef";

/* GET home page. */
router.get('/', function(req, res, next) {
	db.get().collection(collection_name).find({"name": { $exists: true }, "abbreviation": { $exists: true}}).sort({'name': 1}).toArray(function(err, docs) {
		res.render('index', { title: 'Oxlef', team_data: docs });
	});
});

module.exports = router;
