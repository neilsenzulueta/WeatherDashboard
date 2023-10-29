var apiKey = ec7ce69200c64e3c1bd5d2c43074fa60;
var searchForm = document.getElementById("search-form");
var cityInput = document.getElementById("city-input");
var currentWeather = document.getElementById("current-weather");
var searchHistory = document.getElementById("search-history");
var forecast = document.getElementById("forecast");

searchForm.addEventListener("submit", function(e) {
    e.preventDefault();
    var cityName = cityInput.ariaValueMax.trim();

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