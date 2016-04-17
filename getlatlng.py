import urllib2, json, time

file = "locations_2016.txt";
in_file = open(file, "r");
out_file = open("_" + file, "w");

lines = in_file.readlines()

for line in lines:
	time.sleep(.2)
	tokens = line.split("\t")
 	url = urllib2.quote(tokens[3], safe="%/:=&?~#+!$,;'@()*[]")
	data = json.loads(urllib2.urlopen("http://maps.google.com/maps/api/geocode/json?address=" + url + "&sensor=false").read())
	location = data['results'][0]['geometry']['location']
	print location['lat'], location['lng']
	out_file.write(line[:-1] + "\t" + str(location['lat']) + "\t" + str(location['lng']) + "\n")

in_file.close()
out_file.close()
