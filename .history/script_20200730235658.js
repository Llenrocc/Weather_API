// Creating Elements

function initPage() {
    
    const inputEl = document.getElementById("city-input");
    const searchEl = document.getElementById("search-button");
    const clearEl = document.getElementById("clear-history");
    const nameEl = document.getElementById("city-name");
    const currentPicEl = document.getElementById("current-pic");
    const currentTempEl = document.getElementById("temperature");
    const currentHumidityEl = document.getElementById("humidity");4;
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
            //console.log(response);

    // adding current date by pulling from api response
    
    const currentDate = new Date(response.data.dt*1000);
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();

    // month, day & year response to html
    nameEl.innerHTML = response.data.name + " (" + month + "/" + day + "/" + year + ") ";

    // weather icon depending on the conditions
    let weatherPic = response.data.weather[0].icon;

    currentPicEl.setAttribute("src", "http://openweathermap.org/img/wn/" + weatherPic + "@2x.png");

    // Alt Description if the image does not appear 
    currentPicEl.setAttribute("alt", response.data.weather[0].description);

    // Getting current conditions - temp, wind-speed, UV index

    currentTempEl.innerHTML = "Temperature: " + k2f(response.data.main.temp) + " &#176";
    currentHumidityEl.innerHTML = "Humidity: " + response.data.main.humidity + "%";
    currentWindEl.innerHTML = "Wind Speed: " + response.data.wind.speed + " MPH";

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
    let forecastQueryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityID + "&appid" + APIKey;
    axios.get(forecastQueryURL)
    .then(function(response) {
        

    // Response - parse displays forecast for the next 5 days in a for loop - Append forecast to html
    console.log(response);
    const forecastEls = document.querySelectorAll(".forecast");
    for (i = 0; i < forecastEls.length; i++) {
        forecastEls[i].innerHTML = "";
        const forecastIndex = i * 8 + 4;
        const forecastDate = new Date(response.data.list[forecastIndex].dt * 1000);
        const forecastDay = forecastDate.getDate();
        const forecastMonth = forecastDate.getMonth() + 1;
        const forecastYear = forecastDate.getFullYear();
        const forecastDateEl = document.createElement("p");

        forecastDateEl.setAttribute("class", "mt-3 mb-0 forecast-date");
        forecastDateEl.innerHTML = forecastMonth + "/" + forecastDay + "/" + forecastYear;
        forecastEls[i].append(forecastDateEl);

        // Add img depending on weather - append to weather forecast element

        const forecastWeatherEl = document.createElement("img");
        forecastWeatherEl.setAttribute("src", "https://openweathermap.org/img/wn/" + response.data.list[forecastIndex].weather[0].icon + "@2x.png");
        forecastWeatherEl.setAttribute("alt", response.data.list[forecastIndex].weather[0].description);
        forecastEls[i].append(forecastWeatherEl);

        // Adding forecast Temp and Humidity
        const forecastTempEl = document.createElement("p");
        forecastTempEl.innerHTML = "Temp: " + k2f(response.data.list[forecastIndex].main.temp) + " &#176";
        forecastEls[i].append(forecastTempEl);
        
        const forecastHumidityEl = document.createElement("p");
        forecastHumidityEl.innerHTML = "Humidity: " + response.data.list[forecastIndex].main.humidity + "%";
        forecastEls[i].append(forecastHumidityEl);
        }
     });
    });
}

        // Adding event listener "click" to search  & clear button. Save searches to local storage - they will be displayed on screen. Clear past searches

        searchEl.addEventListener("click", function() {
            const searchTerm = inputEl.value;
            getWeather(searchTerm);
            searchHistory.push(searchTerm);
            localStorage.setItem("search", JSON.stringify(searchHistory));
            renderSearchHistory();
});
        clearEl.addEventListener("click", function() {
            searchHistory = [];
            renderSearchHistory();
        });
        
        function k2f(K) {
            return Math.floor((K - 273.15) *1.8 +32);
        }

        // Append search history to HTML in text format - Color of background
        function renderSearchHistory() {
            historyEl.innerHTML = "";
            for (let i = 0; i < searchHistory.length; i++) {
                const historyItem = document.createElement("input");
                historyItem.setAttribute("type", "text");
                historyItem.setAttribute("readonly", true);
                historyItem.setAttribute("class", "form-control d-block bg-white");
                historyItem.setAttribute("value", searchHistory[i]);
                historyItem.addEventListener("click", function() {
                    getWeather(historyItem.value);
                })
                historyEl.append(historyItem);
            }
        }

        // Render search history

        renderSearchHistory();
        if (searchHistory.length > 0) {
            getWeather(searchHistory[searchHistory.length - 1]);
        }
}

initPage();

