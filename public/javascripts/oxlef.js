//
$(document).ready(function() {
	$("#menu").on("click", ".item", function() {
		var team = $(this).attr("data-value");
		$.get("/get_team_stats",
		{
			team: team,
		},
		function(data, status){
			console.log(data);
		});

		$.get("/get_team_data",
		{
			team: team,
		},
		function(data, status){
			//console.log(data);
			$('#chart').highcharts({
				chart: {
					zoomType: 'x'
				},
				title: {
					text: team + "'s Market Capitalization"
				},
				subtitle: {
					text: 'Overall Market Sticker Value Over Time'
				},
				xAxis: {
					type: 'datetime'
				},
				yAxis: {
					title: {
						text: 'Market Capitalization'
					}
				},
				legend: {
					enabled: false
				},
				plotOptions: {
					area: {
						fillColor: {
							linearGradient: {
								x1: 0,
								y1: 0,
								x2: 0,
								y2: 1
							},
							stops: [
								[0, Highcharts.getOptions().colors[0]],
								[1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
							]
						},
						marker: {
							radius: 2
						},
						lineWidth: 1,
						states: {
							hover: {
								lineWidth: 1
							}
						},
						threshold: null
					}
				},

				series: [{
					type: 'area',
					name: 'Market Capitalization',
					data: data
				}]
			});
		});
	});
});