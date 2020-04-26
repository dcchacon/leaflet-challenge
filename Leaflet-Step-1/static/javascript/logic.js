var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Create a map object
var myMap = L.map("map", {
    center: [38, -94.81],
    zoom: 3
});

// Create a light map and add it to myMap
var lightmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
}).addTo(myMap);

// Create an array for the colors and ranges
// colors = Light green, yellow, light orange, dark orange, light red, dark red
var colors = ["#99ffbb", "#ffff80", "#ffdb4d", "#ff9933", "#ff8566", "#801a00"]
var range = ["0-1", "1-2", "2-3", "3-4", "4-5", "5+"]

// Function to get the color for the circles based on magnitud, create the circles, and bindPopup.

function genCircles(feature, latlng) {
    var magnitud = feature.properties.mag;

    var color = "";

    if (magnitud < 1) {
        color = colors[0]
    }
    else if (magnitud < 2) {
        color = colors[1]
    }
    else if (magnitud < 3) {
        color = colors[2]
    }
    else if (magnitud < 4) {
        color = colors[3]
    }    
    else if (magnitud < 5) {
        color = colors[4]
    }   
    else {
        color = colors[5]
    }

    var circles = L.circle(latlng, {
        opacity: 1,
        fillOpacity: 0.75,
        fillColor: color,
        color: "black",
        radius: magnitud * 16000,
        stroke: true,
        weight: 0.5
    }).bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);

    return circles;

}

// Perform a GET request to the query URL
d3.json(queryUrl, function (data) {
    // console.log(data)
    quakeData = data.features;
    L.geoJson(quakeData, {
        pointToLayer: genCircles
    }).addTo(myMap);


});

// Create legend

var legend = L.control({
    position: "bottomright"
});

legend.onAdd = function (myMap) {
    var div = L.DomUtil.create("div", "info legend");
    var labels = []

    // Loop to generate labels and colors for the legend.
    for (var i = 0; i < range.length; i++) {
        // Add elements to the labels array
        labels.push(
            "<i style='background: " + colors[i] + "'></i> " +
            range[i] + "<br>");
    }

    div.innerHTML += labels.join("");

    return div;
};

// Add legend to myMap
legend.addTo(myMap);