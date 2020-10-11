// Store API link
var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

function markerSize(depth) {
  return depth * 30000;
}

function getColor(depth) {
  return depth > 90 ? '#800026':
         depth > 70 ? '#BD0026':
         depth > 50 ? 'E31A1C':
         depth > 30 ? '#FC4E2A':
         depth > 10 ? '#FD8D3C':
         depth > -10 ? '#FEB24C':
         '#FED976';
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
        fillOpacity: 1,
        stroke: false,
    })
  }
  });
    
  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Define satelitemap and darkmap layers
  // var satelitemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  //   attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  //   maxZoom: 18,
  //   id: "mapbox.satellite",
  //   accessToken: API_KEY
  // });

  var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 10,
    id: "light-v10",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    //"Satelite Map": satelitemap,
    "Light Map": lightmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the satelitemap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [0,0],
    zoom: 2,
    layers: [lightmap, earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map

  // L.control.layers(baseMaps, overlayMaps, {
  //   collapsed: false
  // }).addTo(myMap);

}


//   // Adding legend on the map
//   var legend = L.control({position: 'bottomright'});
  
//   legend.onAdd = function (myMap) {
  
//       var div = L.DomUtil.create('div', 'info legend').
//       grades = [-10, 10, 30, 50, 70, 90],
//       labels = [];
  
//       for (var i = 0; i < grades.length; i++) {
//         div.innerHTML += 
//             '<i class="circle" style="background:' + getColor(grades[i]+1) + '"></i> ' +
//         grades[i] + (grades[i+1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
//       }
//     div.innerHTML = labels.join('<br>');
//     return div;
//   };
// legend.addTo(myMap);  
// }
