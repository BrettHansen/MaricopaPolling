locations = [];
function getLocations(callback) {
	$.get("locations.txt", function(data) {
		var lines = data.split('\n');
		for(i in lines) {
			elements = lines[i].split('\t');
			locale = new Object();
			locale.city = elements[0];
			locale.name = elements[1];
			locale.address = elements[2] + ", " + elements[3];
			locale.lat = elements[6];
			locale.lng = elements[7];
			locations.push(locale);
		}
		callback(locations);
	}, "text");
}