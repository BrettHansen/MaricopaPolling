locations = [];
function getLocations(callback) {
	$.get("locations.txt", function(data) {
		var lines = data.split('\n');
		for(i in lines) {
			elements = lines[i].split('\t');
			local = new Object();
			local.city = elements[0];
			local.name = elements[1];
			local.address = elements[2] + ", " + elements[3];
			local.lat = elements[6];
			local.lng = elements[7];
			locations.push(local);
		}
		callback(locations);
	}, "text");
}