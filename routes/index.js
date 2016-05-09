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

router.get('/get_team_stats', function(req, res, next) {
	var team = req.query.team;
	var results = db.get().collection(collection_name).find({"name": team}).toArray(function(err, docs) {
		res.send(docs);
	});
});

router.get('/get_team_data', function(req, res, next) {
	var team = req.query.team;
	var results = db.get().collection(collection_name).find({"team": team}).toArray(function(err, docs) {
		res.send(docs);
	});
});

module.exports = router;
