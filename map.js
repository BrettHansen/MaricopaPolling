var map;
/** 
  * Creates the map object and sets its initial parameters.
  */
function initialize() {
  map = new google.maps.Map($("#map")[0], {
    zoom: 9,
    center: new google.maps.LatLng(33.4, -112),
    streetViewControl : false,
    mapTypeControl : false,
    mapTypeId: google.maps.MapTypeId.TERRAIN,
    minZoom: 9
  });
}
initialize();



map.data.loadGeoJson('./maricopa.geojson', null, function(data) {
  map.data.forEach(function(feature) {
    // Might be removable
  });
});

var style_passive = {
  fillColor : "#f7fbff",
  strokeColor : '#454545',
  strokeOpacity : 0.5,
  strokeWeight : 1
}

var stroke_passive = {
  strokeColor : '#454545',
  strokeOpacity : 0.5,
  strokeWeight : 1
  };

var stroke_active = {
  strokeColor : '#171717',
  strokeOpacity : 1.0,
  strokeWeight : 2
};

map.data.setStyle(style_passive);
map.data.addListener('click', clickFeature);
map.data.addListener('mouseover', hoverFeature);
map.data.addListener('mouseout', unhoverFeature);

var lastClickedFeature;
function clickFeature(event) {
  if(lastClickedFeature !== undefined)
    updateFeatureStyle(lastClickedFeature, stroke_passive)

  lastClickedFeature = event.feature;
  updateFeatureStyle(lastClickedFeature, stroke_active);
}

function hoverFeature(event) {
  updateFeatureStyle(event.feature, stroke_active);
}

function unhoverFeature(event) {
  if(event.feature !== lastClickedFeature)
    updateFeatureStyle(event.feature, stroke_passive);
}

/**
  * Updates the style of a feature given a new style
  */
function updateFeatureStyle(feature, style) {
  var currentStyle = map.data.getStyle(feature);
  for(var key in style) {
    currentStyle[key] = style[key];
  }
  map.data.overrideStyle(feature, currentStyle);
}