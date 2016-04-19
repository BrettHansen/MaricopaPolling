function getColor(feature) {
	return rgbToHex(parseInt(Math.pow(1 - feature.R.WHITEPOP / feature.R.TOTALPOP, 1) * 255), 0,
					parseInt(Math.pow(feature.R.WHITEPOP / feature.R.TOTALPOP, 3) * 255));
}

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function popDensity(feature) {
	return Math.log(feature.R.TOTALPOP) / Math.log(feature.R.ALAND10);
}

function getFeatureStyle(feature) {
  return ({ fillColor     : feature.getProperty("color")          ? feature.getProperty("color")          : "#f7fbff",
            fillOpacity   : feature.getProperty("opacity")        ? feature.getProperty("opacity")        : 0.5,
            strokeColor   : feature.getProperty("stroke_color")   ? feature.getProperty("stroke_color")   : "#454545",
            strokeOpacity : feature.getProperty("stroke_opacity") ? feature.getProperty("stroke_opacity") : 0.5,
            strokeWeight  : feature.getProperty("stroke_weight")  ? feature.getProperty("stroke_weight")  : 1,
          });
};

function getLatLng(feature) {
	return ({lat : parseFloat(feature.R.INTPTLAT10), lng : parseFloat(feature.R.INTPTLON10)});
}

/**
 * Distance between coordinates using equirectangular approximation.
 * Code and formulas based on Chris Veness' work.
 * http://www.movable-type.co.uk/scripts/latlong.html
 */
function getDistance(coord1, coord2) {
	var R = 6371000;
	var phi1 = toRadians(coord1[0]);
	var lam1 = toRadians(coord1[1]);
	var phi2 = toRadians(coord2[0]);
	var lam2 = toRadians(coord2[1]);

	var x = (lam2 - lam1) * Math.cos((phi1 + phi2) / 2);
	var y = phi2 - phi1;
	return Math.sqrt(x * x + y * y) * R * 0.000621371;
}

function minDist(markers, feature) {
	var min;
	var temp;
	var point = [parseFloat(feature.R.INTPTLAT10), parseFloat(feature.R.INTPTLON10)];
	for(i in markers) {
		temp = getDistance([markers[i].position.lat(), markers[i].position.lng()], point);
		if(min === undefined || temp < min)
			min = temp;
	}
	return min;
}

function toRadians(degrees) {
	return degrees / 180 * Math.PI;
}

function generateInfoWindow(feature) {
	return 	'<div id="siteNotice">' +
				'</div>' +
					'<div id="bodyContent">' +
						'<table><th colspan="2">Polling Station Distance:</th><tbody>' +
						'<tr><td>2008</td><td>' + (Math.floor(feature.distances[0] * 100) / 100).toFixed(2) + ' miles</td></tr>' +
						'<tr><td>2012</td><td>' + (Math.floor(feature.distances[1] * 100) / 100).toFixed(2) + ' miles</td></tr>' +
						'<tr><td>2016</td><td>' + (Math.floor(feature.distances[2] * 100) / 100).toFixed(2) + ' miles</td></tr>' +
						'<th colspan="2">White Proportion:</th>' +
						'<tr><td>' + (Math.floor(feature.R.WHITEPOP / feature.R.TOTALPOP * 10000) / 100).toFixed(2) + '%</td></tr>' + 
						'</tbody></table>' +
					'</div>' +
				'</div>' +
			'</div>';
}


var stroke_active = {
  strokeColor : '#171717',
  strokeOpacity : 1.0,
  strokeWeight : 2
};