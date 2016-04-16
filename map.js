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

var ready = false;
var markers = [];
getLocations(function(locations) {
  for(i in locations) {
    markers.push(new google.maps.Marker({
    position: {lat: parseFloat(locations[i].lat), lng: parseFloat(locations[i].lng)},
    map: map,
    title: locations.name
    }));
  }
  if(!ready)
    ready = true;
  else
    colorFeatures();
});

var features = [];
map.data.loadGeoJson('./race.geojson', null, function(data) {
  map.data.forEach(function(feature) {
    features.push(feature);
  });
  if(!ready)
    ready = true;
  else
    colorFeatures();
});

var pop_densities = [];
var max_pop_density;
function colorFeatures() {
  var feature;
  for(i in features) {
    feature = features[i];
    var color = rgbToHex(parseInt(Math.pow(1 - feature.R.WHITEPOP / feature.R.TOTALPOP, 1) * 255), 0, parseInt(Math.pow(feature.R.WHITEPOP / feature.R.TOTALPOP, 3) * 255));
    pop_densities.push(feature.R.TOTALPOP / feature.R.ALAND10);
    feature.setProperty("color", color);
  }
  max_pop_density = Math.max(...pop_densities);
  for(i in features) {
    feature = features[i];
    var density = Math.pow(pop_densities[i] / max_pop_density, .4);
    feature.setProperty("opacity", density);
  }
  map.data.revertStyle();
}

var stroke_active = {
  strokeColor : '#171717',
  strokeOpacity : 1.0,
  strokeWeight : 2
};

map.data.setStyle(function(feature) {
  return ({ fillColor : feature.getProperty("color") ? feature.getProperty("color") : "#f7fbff",
            fillOpacity : feature.getProperty("opacity") ? feature.getProperty("opacity") : 0.5,
            strokeColor : feature.getProperty("stroke_color") ? feature.getProperty("stroke_color") : "#454545",
            strokeOpacity : feature.getProperty("stroke_opacity") ? feature.getProperty("stroke_opacity") : 0.5,
            strokeWeight : feature.getProperty("stroke_weight") ? feature.getProperty("stroke_weight") : 1,
          });
});
map.data.addListener('click', clickFeature);
map.data.addListener('mouseover', hoverFeature);
map.data.addListener('mouseout', unhoverFeature);

var selectedFeature;
function clickFeature(event) {
  if(selectedFeature) {
    selectedFeature.setProperty("stroke_color", false);
    selectedFeature.setProperty("stroke_weight", false);
    selectedFeature.setProperty("stroke_opacity", false);
  }
  selectedFeature = event.feature;
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