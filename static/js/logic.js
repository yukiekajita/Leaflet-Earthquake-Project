// function markerColor(depth){
//     if (-10 <= depth & depth <10){
//         return "#1635D9";
//     }
//     else if (10 <= depth & depth <30){
//         return "#13DECE";
//     }
//     else if (30 <= depth & depth <50){
//         return "#12E510";
//     }
//     else if (50 <= depth & depth <70){
//         return "DCEB0C";
//     }
//     else if (70 <= depth & depth <90){
//         return "#F02908";
//     }
//     else {
//         return "#1635D9k";
//     };
// }


function createMap(earthquakes) {

  // Create the tile layer that will be the background of our map
  var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "light-v10",
    accessToken: API_KEY
  });

    // var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    //   attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    //   maxZoom: 18,
    //   id: "dark-v10",
    //   accessToken: API_KEY
    // });

    // var satelite = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    //   attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    //   maxZoom: 18,
    //   id: "satelite",
    //   accessToken: API_KEY
    // });
  
  // Create a baseMaps object to hold the lightmap layer
  var baseMaps = {
    "Light Map": lightmap
    //"Dark Map": darkmap,
    //"Satelite Map": satelite
  };
  
  // Create an overlayMaps object to hold the bikeStations layer
  var overlayMaps = {
    "Earthquakes": earthquakes
  };
  
  // Create the map object with options
  var myMap = L.map("mapid", {
    enter: [40.73, -74.0059],
    zoom: 13,
    layers: [lightmap, earthquakes]
  });
  
  // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
}

//   // Set up the legend
//   var legend = L.control({ position: "bottomright" });
//   legend.onAdd = function() {
//     var div = L.DomUtil.create("div", "info legend");
//     var grades = ["-10-10", "10-30", "30-50", "50-70", "70-90", "90+"]
//     var colors = ["green", "yellow", "orange", "darkorange", "red"]
    

//     // Add min & max
//     var legendInfo = "<h1>Median Income</h1>" +
//       "<div class=\"labels\">" +
//         "<div class=\"min\">" + limits[0] + "</div>" +
//         "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
//       "</div>";

//     div.innerHTML = legendInfo;

//     limits.forEach(function(limit, index) {
//       labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
//     });

//     div.innerHTML += "<ul>" + labels.join("") + "</ul>";
//     return div;
//   };

//   // Adding legend to the map
//   legend.addTo(myMap);

function createMarkers(response) {

  // Pull the "stations" property off of response.data
  var earthquakes = response.features;
  //console.log(earthquakes);
  
  // Initialize an array to hold bike markers
  var earthquakeMarkers = [];
    
    // Loop through the stations array
    for (var index = 0; index < earthquakes.length; index++) {
      var earthquake = earthquakes[index];
  
      // For each station, create a marker and bind a popup with the station's name
      var marker = L.marker([earthquake.geometry.coordinates[1], earthquake.geometry.coordinates[0]], {
          radius: earthquake.properties.mag * 2,
          //fillColor: markerColor(earthquake.geometry.coordinates[2]),
          fillOpacity: 0.75,
          stroke: false
      })
        .bindPopup("<h3>" + earthquake.properties.place + "</h3><hr><h3>" + (earthquake.properties.mag) +"</h3>");
    
      // Add the marker to the bikeMarkers array
      earthquakeMarkers.push(marker);
    }
    console.log(marker);
    console.log(earthquakeMarkers);
    // Create a layer group made from the bike markers array, pass it into the createMap function
    createMap(L.layerGroup(earthquakeMarkers));
}
  
  // Perform an API call to the Citi Bike API to get station information. Call createMarkers when complete
  d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", createMarkers);
  
