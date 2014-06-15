var api_uri = 'http://www.kimonolabs.com/api/4k3xczfi?apikey=664315ac6dd2128d90351faeb721fb63';
//var api_uri = "http://api.openweathermap.org/data/2.5/weather?q=London,uk";

// http://qiita.com/osakanafish/items/c64fe8a34e7221e811d0
/*
 * 日付をフォーマットする
 * @param  {Date}   date     日付
 * @param  {String} [format] フォーマット
 * @return {String}          フォーマット済み日付
 */
var formatDate = function (date, format) {
  if (!format) format = 'YYYY-MM-DD hh:mm:ss.SSS';
  format = format.replace(/YYYY/g, date.getFullYear());
  format = format.replace(/MM/g, ('0' + (date.getMonth() + 1)).slice(-2));
  format = format.replace(/DD/g, ('0' + date.getDate()).slice(-2));
  format = format.replace(/hh/g, ('0' + date.getHours()).slice(-2));
  format = format.replace(/mm/g, ('0' + date.getMinutes()).slice(-2));
  format = format.replace(/ss/g, ('0' + date.getSeconds()).slice(-2));
  if (format.match(/S/g)) {
    var milliSeconds = ('00' + date.getMilliseconds()).slice(-3);
    var length = format.match(/S/g).length;
    for (var i = 0; i < length; i++) format = format.replace(/S/, milliSeconds.substring(i, i + 1));
  }
  return format;
};

var refresh = function(data) {
		var matches = data.results.collection1;
		var match_text = '';
		
		matches.sort(
			function(a, b) {
				var aDate = new Date(a.match_day + ' 2014 ' + a.match_time + ':00 GMT+0000 (UTC)');
				var bDate = new Date(b.match_day + ' 2014 ' + b.match_time + ':00 GMT+0000 (UTC)');
				if( aDate < bDate ) return -1;
				if( aDate > bDate ) return 1;
				return 0;
			}
		);
		//console.log(matches[0].team_name.text);	
		var today = new Date();
		var first_date;
		var next_date;
		var score;
		//match_text = today + '\n';
		today.setHours(0);
		today.setMinutes(0);
		today.setSeconds(0);
		
		// show only first day from today
		for ( var i=0; i < data.count; i++) {
			var match_date = new Date(matches[i].match_day + ' 2014 ' + matches[i].match_time + ':00 GMT+0000 (UTC)');
			if( today <= match_date ) {
				first_date = match_date;
				next_date = new Date(first_date.getFullYear(),first_date.getMonth(),first_date.getDate()+1);
				break;
			}
		}
		
		for (i=0; i < data.count; i++) {
			// date
			var match_date = new Date(matches[i].match_day + ' 2014 ' + matches[i].match_time + ':00 GMT+0000 (UTC)');
			if( 
				( (match_date.getMonth()==first_date.getMonth()) && 
					(match_date.getDate()==first_date.getDate()) )	||
				( (match_date.getMonth()==next_date.getMonth()) && 
					(match_date.getDate()==next_date.getDate()) )
				)
				{
				} else {
					continue;
				}
			// score
			if( matches[i].score == "? - ?" ) {
				score = ' ' + matches[i].score + ' '; 
			} else {
				score = ' ' + matches[i].score + ' '; 
			} 
			// team
			//var teams = matches[i].team_name.text.match(/([A-Z].*) vs ([A-Z].*)/);
			//home_team_name = teams[0];
			//away_team_name = teams[1];
			
			//console.log(match_date);
			match_text = match_text + 
				//match_date + ' ' +
				//home_team_name + ' ' + 
				formatDate(match_date, 'MM/DD hh:mm') + ' ' +
				matches[i].team_name.text + ' ' +
				score + ' ' +
				//away_team_name + 
				'\n\n';
		}
		//console.log(match_text);
		// NOTE: don't display too many text!
		simply.text({
			title	: 'WC2014',
			body    : match_text
		});
		
		match_status = window.localStorage.getItem('match_status');
//		if( match_status != match_text ) {
//			simply.vibe();
//		}
		window.localStorage.setItem('match_status', match_text);
}

function HTTPGET(url) {
	var req = new XMLHttpRequest();
	req.open("GET", url, false);
	req.send(null);
	return req.responseText;
}

var getWeather = function() {
	//Get weather info
	var response = HTTPGET(api_uri);
	//console.log(response);

	//Convert to JSON
	var json = JSON.parse(response);
	
	//Extract the data
	var temperature = 100;//Math.round(json.main.temp - 273.15);
	var location = "Tokyo";


	//Console output to check all is working.
	console.log("It is " + temperature + " degrees in " + location + " today!");

	//Construct a key-value dictionary
	var dict = {"KEY_LOCATION" : location, "KEY_TEMPERATURE": temperature};

	//Send data to watch for display
	Pebble.sendAppMessage(dict);
};

Pebble.addEventListener("appmessage",
  function(e) {
    //Watch wants new data!
    getWeather();
  }
);

Pebble.addEventListener("ready",
  function(e) {
    //App is ready to receive JS messages
	getWeather();
  }
);
