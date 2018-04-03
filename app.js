var app = {};
app.dom = {};

// function that runs when page has loaded
app.init = function() {

    // log to console
    console.log("App is running.")

    // run these functions on page load
    app.setupDom();
    app.addListeners();
    app.getUserLocation();

    // create container
    var container = document.createElement("div");

    // add class to container
    container.classList.add("container");

    document.body.appendChild(container)

}



// function to get users location
app.getUserLocation = function() {

    // if GeoLocation exists
    if ("geolocation" in navigator) {

        // log to console
        console.log("Searching for your location...")

        // options for GeoLocation
        var options = {
            enableHighAccuracy: true,
            maximumAge: 0
        };

        // if GeoLocation is successfull
        function success(pos) {
            var coords = pos.coords;

            app.nearestStationsRequestUrl(coords);

        }

        // if GeoLocation is supported but there's an error
        function error(err) {
            console.warn(`ERROR(${err.code}): ${err.message}`);
        }

        // callback function
        navigator.geolocation.getCurrentPosition(success, error, options);

    } else {

        // log to console
        console.log("GeoLocation is not supported");
    }
}

// run the findNearestStations to 
app.nearestStationsRequestUrl = function(coords) {

    //log user's position to console
    console.log('Your current position is:');
    console.log(`Latitude : ${coords.latitude}`);
    console.log(`Longitude: ${coords.longitude}`);
    console.log(`More or less ${coords.accuracy} meters.`);

    // create the request url with appID, appKey, base url and the coordinates
    var appID = "f6f36129",
        appKey = "2b9b604a4495fb6e73df681edba652a1",
        lat = coords.latitude,
        lon = coords.longitude,
        url = "https://transportapi.com/v3/uk/train/stations/near.json?app_id=" + appID + "&app_key=" + appKey + "&lat=" + lat + "&lon=" + lon;

    app.request(url, app.findNearestStations);
}

app.findNearestStations = function(data) {

    var stations = data.stations;
    var numberOfStations = stations.length;
    var stationNames = stations.name;

    var stationsArray = app.createElements(numberOfStations, "div");
    var stationsNamesArray = app.createElements(numberOfStations, "span");


    // var stationNamesArray = app.createElements(stationNamesArray, "span");

    // for(var h = 0; h < stationNames.length; h++) {

    //     stationNamesArray[h].classList.add("station-name");

    // }

    // var stationsArray = app.createElements(numberOfStations, "div");
    


    // for(var i = 0; i < stationsArray.length; i++) {

    //     stationsArray[i].classList.add("station");

    // }




    app.dom.container = document.querySelector(".container")

    app.appendElements(stationsArray, app.dom.container)

    console.log(stationsArray)

};

app.createElements = function(numberOfElements, typeOfElement) {

    var elementsArray = [];

    for (var i = 0; i < numberOfElements; i++) {


        if(typeOfElement === "div") {
            var element = document.createElement("div");

        } else if (typeOfElement === "span") {
            var element = document.createElement("span");
        }

        elementsArray.push(element);

    }

    return elementsArray
}

app.appendElements = function(elementsArray, container) {

    for (var i = 0; i < elementsArray.length; i++) {

        container.appendChild(elementsArray[i]);

    }

}

app.setupDom = function() {

    console.log("Setting up DOM.")

    app.dom.collapsedRouteInfo = document.querySelectorAll(".collapsed-route-info");
    app.dom.expandedRouteInfo = document.querySelectorAll(".expanded-route-info");

    app.dom.container

    //    app.dom.searchButton = document.querySelector(".search-button");


}

app.addListeners = function() {

    console.log("Adding event listeners.")

    // add event listener to service item
    for (var i = 0; i < app.dom.collapsedRouteInfo.length; i++) {

        app.dom.collapsedRouteInfo[i].addEventListener("click", app.collapsedRouteInfoClickHandler);

    }

    // add event listener to expanded route info section
    for (var i = 0; i < app.dom.expandedRouteInfo.length; i++) {

        app.dom.expandedRouteInfo[i].addEventListener("click", app.expandedRouteInfoClickHandler);

    }
}

app.request = function(requestUrl, callback) {

    var request = new XMLHttpRequest();
    request.open('GET', requestUrl, true);

    request.onload = function() {
        if (this.status >= 200 && this.status < 400) {
            // Success!
            var data = JSON.parse(this.response);

            callback(data);

        } else {
            // We reached our target server, but it returned an error

        }
    };

    request.onerror = function() {
        // There was a connection error of some sort
    };

    request.send();


}













window.onload = app.init;