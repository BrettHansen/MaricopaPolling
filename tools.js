/**
 * Returns the appropriate color given a feature.
 */
function getColor(feature) {
	return rgbToHex(parseInt(Math.pow(1 - getFeatureProperty(feature, "WHITEPOP") / getFeatureProperty(feature, "TOTALPOP"), 1) * 255), 0,
					parseInt(Math.pow(getFeatureProperty(feature, "WHITEPOP") / getFeatureProperty(feature, "TOTALPOP"), 3) * 255));
}

/**
 * Converts an 8-bit integer to hex.
 */
function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

/**
 * Converts an rgb triple to hex.
 */
function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

/**
 * Returns population density of a feature.
 */
function popDensity(feature) {
	return Math.log(getFeatureProperty(feature, "TOTALPOP")) / Math.log(getFeatureProperty(feature, "ALAND10"));
}

/**
 * Returns the appropriate feature style based on the feature's properties.
 */
function getFeatureStyle(feature) {
  return ({ fillColor     : feature.getProperty("color")          ? feature.getProperty("color")          : "#f7fbff",
            fillOpacity   : feature.getProperty("opacity")        ? feature.getProperty("opacity")        : 0.5,
            strokeColor   : feature.getProperty("stroke_color")   ? feature.getProperty("stroke_color")   : "#454545",
            strokeOpacity : feature.getProperty("stroke_opacity") ? feature.getProperty("stroke_opacity") : 0.5,
            strokeWeight  : feature.getProperty("stroke_weight")  ? feature.getProperty("stroke_weight")  : 1,
          });
};

/**
 * Returns the feature's lat-lng coordinates.
 */
function getLatLng(feature) {
	return ({lat : parseFloat(getFeatureProperty(feature, "INTPTLAT10")), lng : parseFloat(getFeatureProperty(feature, "INTPTLON10"))});
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

/**
 * Returns the minimum distance between an array of markers and a feature.
 */
function minDist(markers, feature) {
	var min;
	var temp;
	var point = [parseFloat(getFeatureProperty(feature, "INTPTLAT10")), parseFloat(getFeatureProperty(feature, "INTPTLON10"))];
	for(i in markers) {
		temp = getDistance([markers[i].position.lat(), markers[i].position.lng()], point);
		if(min === undefined || temp < min)
			min = temp;
	}
	return min;
}

/**
 * Returns radians from degrees.
 */
function toRadians(degrees) {
	return degrees / 180 * Math.PI;
}

/**
 * Generates the info window using a feature's properties.
 */
function generateInfoWindow(feature) {
	return 	'<div id="siteNotice">' +
				'</div>' +
					'<div id="bodyContent">' +
						'<table><th colspan="2">Polling Station Distance:</th><tbody>' +
						'<tr><td>2008</td><td>' + (Math.floor(feature.distances[0] * 100) / 100).toFixed(2) + ' miles</td></tr>' +
						'<tr><td>2012</td><td>' + (Math.floor(feature.distances[1] * 100) / 100).toFixed(2) + ' miles</td></tr>' +
						'<tr><td>2016</td><td>' + (Math.floor(feature.distances[2] * 100) / 100).toFixed(2) + ' miles</td></tr>' +
						'<th colspan="2">White Proportion:</th>' +
						'<tr><td>' + (Math.floor(getFeatureProperty(feature, "WHITEPOP") / getFeatureProperty(feature, "TOTALPOP") * 10000) / 100).toFixed(2) + '%</td></tr>' + 
						'</tbody></table>' +
					'</div>' +
				'</div>' +
			'</div>';
}

function getFeatureProperty(feature, prop) {
	for(var key in feature)
		if(feature !== undefined && feature[key] !== undefined && feature[key][prop] !== undefined)
			return feature[key][prop];
	
	return undefined;
}

/**
 * Properties of an active stroke.
 */
var stroke_active = {
  strokeColor : '#171717',
  strokeOpacity : 1.0,
  strokeWeight : 2
};