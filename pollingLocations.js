locations = [];
$.get("locations.txt", function(data) {
	var lines = data.split('\n');
	console.log(lines);
	for(i in lines) {
		elements = lines[i].split('\t');
		location = new Object();
		location.city = elements[0];
		location.name = elements[1];
		location.address = elements[2] + ", " + elements[3];
		location.lat = elements[4];
		location.lng = elements[5];
		console.log(location);
	}
}, "text");

console.log("here");