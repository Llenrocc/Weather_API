// Creating all variables/Elements

function initPage () {

    const inputEl = document.getElementById("city-input");
    const searchEl = document.getElementById("search-button");
    const clearEl = document.getElementById("clear-history");
    const nameEl = document.getElementById("city-name");
    const currentPicEl = document.getElementById("current-pic");
    const currentTempEl = document.getElementById("temperature");
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
        })
    }

}

api.openweathermap.org/data/2.5/weather?q={city name}&appid={1c0d091d3970be12422646d1b4954478}