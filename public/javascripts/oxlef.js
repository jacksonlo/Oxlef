//
$(document).ready(function() {
	//Initialize Chart and stats
	var initial_team = "Astralis";
	$("#contentTitle").html(initial_team);
	$("#teamLogo").attr("src", "/images/teams/" + initial_team.replace(/ /g, "_") + "_banner.png");

	$.get("/get_team_stats",
	{
		team: initial_team.replace(/ /g, "_"),
	},
	function(data, status){
		//console.log(data);
		$("#lowest").find("small").text(formatValue(data.lowest.market_cap));
		$("#highest").find("small").text(formatValue(data.highest.market_cap));
		$("#average").find("small").text(formatValue(data.average.average));
		$("#marketCap").find("small").text(formatValue(data.market_cap.market_cap));
	});

	$.get("/get_team_data",
	{
		team: initial_team,
	},
	function(data, status){
		$('#chart').highcharts({
			chart: {
				zoomType: 'x'
			},
			title: {
				text: initial_team + "'s Volumes in Sales"
			},
			subtitle: {
				text: 'Overall Market Sticker Sales Overtime'
			},
			xAxis: {
				type: 'datetime',
				labels: {
	                rotation: -45
	            }
			},
			yAxis: {
				title: {
					text: 'US Dollars'
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
				name: 'Volume',
				data: data
			}]
		});
	});

	//Bind changing chart
	$("#menu").on("click", ".item", function() {
		var team = $(this).attr("data-value");
		$.get("/get_team_stats",
		{
			team: team.replace(/ /g, "_"),
		},
		function(data, status){
			//console.log(data);
			$("#lowest").find("small").text(formatValue(data.lowest.market_cap));
			$("#highest").find("small").text(formatValue(data.highest.market_cap));
			$("#average").find("small").text(formatValue(data.average.average));
			$("#marketCap").find("small").text(formatValue(data.market_cap.market_cap));
		});

		$.get("/get_team_data",
		{
			team: team.replace(/ /g, "_"),
		},
		function(data, status){
			//console.log(data);
			$("#contentTitle").html(team);
			$("#teamLogo").attr("src", "/images/teams/" + team.replace(/ /g, "_") + "_banner.png")
			var chart = $("#chart").highcharts();
			chart.setTitle({
				text: team + "'s Volumes in Sales"
			});
			chart.series[0].setData(data);
		});
	});


	//Format big numbers by space separating and rounding to 2 dec
	function formatValue(val){
		val = val.toFixed(2);
    	while (/(\d+)(\d{3})/.test(val.toString())){
      		val = val.toString().replace(/(\d+)(\d{3})/, '$1'+' '+'$2');
    	}
    	return val;
  	}
});