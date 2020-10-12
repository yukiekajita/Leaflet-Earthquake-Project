// Store API link
var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

function markerSize(depth) {
  return depth * 40000;
}

function getColor(depth) {
  return depth > 90 ? 'darkred':
         depth > 70 ? 'maroon':
         depth > 50 ? 'firebrick':
         depth > 30 ? 'tomato':
         depth > 10 ? 'salmon':
         depth > -10 ? 'pink':
         'black';
}

// Perform a GET request to the query URL
d3.json(link, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {

  var earthquakes = L.geoJSON(earthquakeData, {
  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  onEachFeature : function (feature, layer) {

    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" + "<p> Magnitude: " +  feature.properties.mag + "</p>")
    },     
    pointToLayer: function (feature, latlng) {
      return new L.circle(latlng,
        {radius: markerSize(feature.properties.mag),
        fillColor: getColor(feature.geometry.coordinates[2]),
        color: 'black',
        fillOpacity: 0.75,
        stroke: false,
    })
  }
  });
    
  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}

function createMap(earthquakes) {

  //Define satelitemap and darkmap layers
  var satelitemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: API_KEY
  });

  var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 10,
    id: "light-v10",
    accessToken: API_KEY
  });

  var outdoors = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 10,
    id: "outdoors-v11",
    accessToken: API_KEY
  });

  // Set up tectonic plates line layer
  var tectonicLine = new L.LayerGroup();

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Satelite": satelitemap,
    "Grayscale": lightmap,
    "Outdoors": outdoors,
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    "Earthquakes": earthquakes,
    "Tectonic Plates" : tectonicLine
  };

  // Create our map, giving it the satelitemap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [20,-94],
    zoom: 3,
    layers: [satelitemap, tectonicLine, earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map

  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  // Query to retrieve the tectonic plates line from github
  var tectonicData = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";

  // Create tje lines and add to the layer
  d3.json(tectonicData, function(data){
  L.geoJSON(data, {
    style: function(){
      return {color: "gold", fillOpacity: 0}
    }
  }).addTo(tectonicLine)
  })

  // Adding legend on the map
  var legend = L.control({position: 'bottomright'});
  
  legend.onAdd = function (myMap) {
  
    var div = L.DomUtil.create('div', 'info legend'),
      grades = [-10, 10, 30, 50, 70, 90],
      labels = [];
  
    for (var i = 0; i < grades.length; i++) {
      div.innerHTML += 
        '<i style="background:' + getColor(grades[i]+1) + '"></i> ' +
        grades[i] + (grades[i+1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
  }
    //div.innerHTML = labels.join('<br>');
  return div;
  };
legend.addTo(myMap);  
}
