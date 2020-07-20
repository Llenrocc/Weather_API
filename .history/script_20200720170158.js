// Creating all variables/Elements

function initPage () {

    const inputEl = document.getElementById("city-input");
    const searchEl = document.getElementById("search-button");
    const clearEl = document.getElementById("clear-history");
    const nameEl = document.getElementById("city-name");
    const currentPicEl = document.getElementById("current-pic");
    const currentTempEl = document.getElementById("temperature");
    const currentHumidityEl = document.getElementById("humidity");4
    const currentWindEl = document.getElementById("wind-speed");
    const currentUVEl = document.getElementById("UV-index");
    const historyEl = document.getElementById("history");

    // Save searches to local storage
    let searchHistory = JSON.parse(localStorage.getItem("search")) || [];
    console.log(searchHistory);

    const APIKey = "1c0d091d3970be12422646d1b4954478";

    // Search by City name typed by the user when the search button is clicked

    function getWeather(cityName) {

    // get request using city name, from openweatherAPI
    
        let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + APIKey;
        axios.get(queryURL)
        .then(function(response) {
            console.log(response);

    // Response has to be parsed so it displays current weather conditions 
    
    const currentDate = new Date(response.data.dt*1000);
    console.log(currentDate);
    const day = currentDate.getDate();
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();

    // month, day & year response added to HTML
    nameEl.innerHTML = response.data.name + " (" + month + "/" + day + "/" + year + ") ";

    // weather icon depending on the conditions
    let weatherPic = response.data.weather[0].icon;

    currentPicEl.setAttribute("src", "https://openweathermap.org/img/wn/" + weatherPic + "@2x.png");

    // Alt Description if the image does not appear 
    currentPicEl.setAttribute("alt", response.data.weather[0].description);

    // Getting current conditions - temp, wind-speed, UV index

    currentTempEl.innerHTML = "Temperature: " + k2f(response.data.main.temp) + " &#176";
    currentHumidityEl.innerHTML = "Humidity: " + response.data.main.humidity + "%";
    currentWindEl.innerHTML = "Wind Speed: " + response.data.wind.speed + " KPH";

    // Latitude and Longitude & append UV index to html

    let lat = response.data.coord.lat;
    let lon = response.data.coord.lon;
    let UVQueryURL = "https://api.openweathermap.org/data/2.5/uvi/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey + "&cnt=1";
    axios.get(UVQueryURL)
    .then(function(response) {
        let UVIndex = document.createElement("span");
        UVIndex.setAttribute("class", "badge badge-danger");
        UVIndex.innerHTML = response.data[0].value;
        currentUVEl.innerHTML = "UV Index: ";
        currentUVEl.append(UVIndex);
    });

    // Execute 5 Day forecast get request using saved city name

    let cityID = response.data.id;
    let forecastQueryURL = "https://api.openweathermap.org/data/2.5/forecast?id" + cityID + "&appid" + APIKey;
    axios.get(forecastQueryURL)
    .then(function(response) {
        console.log(response);

    // Response - parse displays forecast for the next 5 days in a for loop
    
    const forecastEls = document.querySelectorAll(".forecast");
    for (i = 0; i < forecastEls.length; i++) {
        forecastEls[i].innerHTML = "";
        const forecastIndex = i*8 + 4;
        const forecastDate = new Date(response.data.list[forecastIndex].dt * 1000);
    }
    })
        })
    }

}

//api.openweathermap.org/data/2.5/weather?q={city name}&appid={1c0d091d3970be12422646d1b4954478}