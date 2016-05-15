var express = require('express');
var router = express.Router();
var _ = require('csgo-api-migrations/node_modules/underscore');

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
	db.get().collection("oxlef_" + team).find().sort({market_cap: -1}).limit(1).toArray(function(err, highest) {
		db.get().collection("oxlef_" + team).find().sort({market_cap: 1}).limit(1).toArray(function(err, lowest) {
			db.get().collection("oxlef_" + team).aggregate({ 
				"$group": {
					"_id": null, 
					"average": { "$avg": "$market_cap" } 
				} 
			}, function(err, average) {
				db.get().collection("oxlef_" + team).aggregate({
					"$group": {
						"_id": null,
						"market_cap": { "$sum": "$market_cap" }
					}
				}, function(err, market_cap) {
					res.send({highest: highest[0], lowest: lowest[0], average: average[0], market_cap: market_cap[0]});
				});
			});
		});
	});
	
});

router.get('/get_team_data', function(req, res, next) {
	var team = req.query.team;
	db.get().collection("oxlef_" + team).find({}, {_id: 1, market_cap: 1}).sort({ _id: 1 }).toArray(function(err, docs) {
		var result = [];
		_.each(docs, function(doc) {
			var date = Date.UTC(doc._id.year, doc._id.month, doc._id.day);
			result.push([date, parseFloat(doc.market_cap.toFixed(2))]);
		});
		res.send(result);
	});
});

module.exports = router;
