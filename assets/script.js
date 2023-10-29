var apiKey = ec7ce69200c64e3c1bd5d2c43074fa60;
var searchForm = document.getElementById("search-form");
var cityInput = document.getElementById("city-input");
var currentWeather = document.getElementById("current-weather");
var searchHistory = document.getElementById("search-history");
var forecast = document.getElementById("forecast");

searchForm.addEventListener("submit", function(e) {
    e.preventDefault();
    var cityName = cityInput.value.trim();

    if (cityName) {
        getWeatherData(cityName);
        cityInput.value = "";
    }
});

function getWeatherData(cityName) {
    var apiKey = "ec7ce69200c64e3c1bd5d2c43074fa60";
    
    var apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`;

    fetch(apiUrl)
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then((data) => {
            updateCurrentWeather(data);
        })
        .catch((error) => {
            console.error('There was a problem with the fetch operation:', error);
        });
}
function updateCurrentWeather(data) {

    if (data && data.main && data.weather && data.weather[0]) {
        var cityName = data.name;
        var date = new Date(data.dt * 1000); 
        var iconCode = data.weather[0].icon;
        var temperature = data.main.temp;
        var humidity = data.main.humidity;
        var windSpeed = data.wind.speed;

        var iconElement = document.createElement("img");
        iconElement.setAttribute("src", `https://openweathermap.org/img/w/${iconCode}.png`);
        iconElement.setAttribute("alt", data.weather[0].description);

        currentWeather.innerHTML = `
            <h2>${cityName} (${date.toLocaleDateString()}) <img src="${iconElement.getAttribute("src")}" alt="${iconElement.getAttribute("alt")}"></h2>
            <p>Temperature: ${temperature}°C</p>
            <p>Humidity: ${humidity}%</p>
            <p>Wind Speed: ${windSpeed} m/s</p>
        `;
    } else {
        currentWeather.innerHTML = "City not found or data unavailable.";
    }
}
function updateForecast(data) {
    if (data && data.list) {
        var forecastData = data.list;

        forecast.innerHTML = '';

        for (let i = 0; i < forecastData.length; i += 8) {
            var forecastItem = forecastData[i];

            var date = new Date(forecastItem.dt * 1000); 
            var iconCode = forecastItem.weather[0].icon;
            var temperature = forecastItem.main.temp;
            var humidity = forecastItem.main.humidity;
            var windSpeed = forecastItem.wind.speed;

            var iconElement = document.createElement("img");
            iconElement.setAttribute("src", `https://openweathermap.org/img/w/${iconCode}.png`);
            iconElement.setAttribute("alt", forecastItem.weather[0].description);

            var forecastItemElement = document.createElement("div");
            forecastItemElement.classList.add("col-md-2", "forecast-item");
            forecastItemElement.innerHTML = `
                <h5>${date.toLocaleDateString()}</h5>
                <img src="${iconElement.getAttribute("src")}" alt="${iconElement.getAttribute("alt")}">
                <p>Temp: ${temperature}°C</p>
                <p>Humidity: ${humidity}%</p>
                <p>Wind: ${windSpeed} m/s</p>
            `;

            forecast.appendChild(forecastItemElement);
        }
    } else {
        forecast.innerHTML = "Forecast data not available.";
    }
}
function saveSearchHistory(cityName) {
    var searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];

    if (!searchHistory.includes(cityName)) {
        searchHistory.push(cityName);

        var maxHistoryEntries = 10;
        if (searchHistory.length > maxHistoryEntries) {
            searchHistory.shift(); 
        }

        localStorage.setItem("searchHistory", JSON.stringify(searchHistory));

        displaySearchHistory();
    }
}
function displaySearchHistory() {
    var searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];

    var searchHistoryContainer = document.getElementById("search-history");

    searchHistoryContainer.innerHTML = '';

    searchHistory.forEach((city) => {
        var historyItem = document.createElement("button");
        historyItem.textContent = city;
        historyItem.classList.add("btn", "btn-light", "w-100", "mb-2");
        
        historyItem.addEventListener("click", function () {
            getWeatherData(city);
        });
        
        searchHistoryContainer.appendChild(historyItem);
    });
}

