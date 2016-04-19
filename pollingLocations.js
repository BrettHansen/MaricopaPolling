var pinImages = [getPinImage("FE7569"), getPinImage("3F9BBA"), getPinImage("57C96E")];
/**
 * Gets pin images courtesy of google.
 */
function getPinImage(color) {
	return 	new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + color,
    		new google.maps.Size(21, 34),
    		new google.maps.Point(0,0),
    		new google.maps.Point(10, 34));
}

/**
 * Gets the location data and converts it into markers.
 */
function getLocations(callback) {
	var markers_all = [];
	$.get("./data/locations_2008.txt", function(data) {
		markers_all[0] = parseLocationData(data, 0);
		signalCallback(markers_all, callback);
	}, "text");
	$.get("./data/locations_2012.txt", function(data) {
		markers_all[1] = parseLocationData(data, 1);
		signalCallback(markers_all, callback);
	}, "text");
	$.get("./data/locations_2016.txt", function(data) {
		markers_all[2] = parseLocationData(data, 2);
		signalCallback(markers_all, callback);
	}, "text");
}

/**
 * Parses location data and creates markers from it.
 */
function parseLocationData(data, index) {
	var markers = [];
	var lines = data.split('\n');
	for(i in lines) {
		elements = lines[i].split('\t');
		markers.push(new google.maps.Marker({
			position : {lat : parseFloat(elements[5]), lng : parseFloat(elements[6])},
			title : elements[2],
			icon : pinImages[index]
		}));
	}
	return markers;
}

/**
 * Call the callback once all three marker location files are parsed.
 */
function signalCallback(all, callback) {
	if(all[0] && all[1] && all[2])
		callback(all[0], all[1], all[2]);
}