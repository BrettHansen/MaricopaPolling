var map;
/** 
  * Creates the map object and sets its initial parameters.
  */
function initialize() {
  map = new google.maps.Map($("#map")[0], {
    zoom: 11,
    center: new google.maps.LatLng(33.5, -112.1),
    streetViewControl : false,
    mapTypeControl : false,
    mapTypeId: google.maps.MapTypeId.TERRAIN,
    minZoom: 9
  });
}
initialize();
map.data.setStyle(getFeatureStyle);
map.data.addListener('click', clickFeature);
map.data.addListener('mouseover', hoverFeature);
map.data.addListener('mouseout', unhoverFeature);

var features = [];
map.data.loadGeoJson('./data/race.geojson', null, function(data) {
  map.data.forEach(function(feature) {
    features.push(feature);
  });
  colorFeatures();
});

var markers_2008 = [];
var markers_2012 = [];
var markers_2016 = [];
getLocations(function(locale_2008, locale_2012, locale_2016) {
  markers_2008 = locale_2008;
  markers_2012 = locale_2012;
  markers_2016 = locale_2016;
  setMarkers(markers_2008, true);
  setMarkers(markers_2012, true);
  setMarkers(markers_2016, true);
});

$("#polls_2008").click(function(event) {
  setMarkers(markers_2008, this.checked);
});
$("#polls_2012").click(function(event) {
  setMarkers(markers_2012, this.checked);
});
$("#polls_2016").click(function(event) {
  setMarkers(markers_2016, this.checked);
});
$("#polls_2008").prop("checked", true);
$("#polls_2012").prop("checked", true);
$("#polls_2016").prop("checked", true);

function setMarkers(markers, on) {
  if(on) {
    for(i in markers)
      markers[i].setMap(map);
  } else {
    for(i in markers)
      markers[i].setMap(null);
  }
}

var pop_densities = [];
var max_pop_density;
function colorFeatures() {
  for(i in features) {
    pop_densities.push(popDensity(features[i]));
    features[i].setProperty("color", getColor(features[i]));
  }
  max_pop_density = Math.max(...pop_densities);
  for(i in features) {
    features[i].setProperty("opacity", Math.pow(pop_densities[i] / max_pop_density, 7));
  }
  map.data.revertStyle();
}

var selectedFeature;
var infoWindow = new google.maps.InfoWindow();
function clickFeature(event) {
  if(selectedFeature) {
    selectedFeature.setProperty("stroke_color", false);
    selectedFeature.setProperty("stroke_weight", false);
    selectedFeature.setProperty("stroke_opacity", false);
  }
  selectedFeature = event.feature;
  if(selectedFeature.distances === undefined) {
    selectedFeature.distances = [ minDist(markers_2008, selectedFeature),
                                  minDist(markers_2012, selectedFeature),
                                  minDist(markers_2016, selectedFeature)];
  }
  infoWindow.close()
  infoWindow.setContent(generateInfoWindow(selectedFeature));
  infoWindow.setPosition(getLatLng(selectedFeature));
  infoWindow.open(map);

  selectedFeature.setProperty("stroke_color", "#171717");
  selectedFeature.setProperty("stroke_weight", 2);
  selectedFeature.setProperty("stroke_opacity", 1.0);
  map.data.revertStyle();
}

function hoverFeature(event) {
  map.data.overrideStyle(event.feature, stroke_active);
}

function unhoverFeature(event) {
  map.data.revertStyle();
}