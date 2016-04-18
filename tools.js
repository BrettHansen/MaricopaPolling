function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
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

function calculateMinDist(markers, latStr, lonStr) {
	var min;
	var temp;
	var point = [parseFloat(latStr), parseFloat(lonStr)];
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

function generateInfoWindow(tot_white, tot_pop, dist_2008, dist_2012, dist_2016) {
	return 	'<div id="siteNotice">' +
				'</div>' +
					'<div id="bodyContent">' +
						'<table><th colspan="2">Polling Station Distance:</th><tbody>' +
						'<tr><td>2008</td><td>' + (Math.floor(dist_2008 * 100) / 100).toFixed(2) + ' miles</td></tr>' +
						'<tr><td>2012</td><td>' + (Math.floor(dist_2012 * 100) / 100).toFixed(2) + ' miles</td></tr>' +
						'<tr><td>2016</td><td>' + (Math.floor(dist_2016 * 100) / 100).toFixed(2) + ' miles</td></tr>' +
						'<th colspan="2">White Proportion:</th>' +
						'<tr><td>' + (Math.floor(tot_white / tot_pop * 10000) / 100).toFixed(2) + '%</td></tr>' + 
						'</tbody></table>' +
					'</div>' +
				'</div>' +
			'</div>';
}