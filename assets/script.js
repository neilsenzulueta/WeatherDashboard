// API key for OpenWeatherMap.
var apiKey = "ec7ce69200c64e3c1bd5d2c43074fa60";

// References to HTML elements.
var searchForm = document.getElementById("search-form");
var cityInput = document.getElementById("city-input");
var submitButton = document.getElementById("submit-btn");

// Event listener to the submit button.
submitButton.addEventListener("click", function (e) {
    e.preventDefault();

    // API URLs for current weather and 5-day forecast.
    var cityName = cityInput.value;
    var apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=imperial&appid=${apiKey}`;
    var forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=imperial&appid=${apiKey}`;

    // Fetch and handle the current weather data.
    fetch(apiUrl)
        .then(function (response) {
            if (response.ok) {
                return response.json();
            } else {
              throw new Error("Network response was not ok: " + response.status);
            }
        })
        .then(function (data){
            var iconCode = data.weather[0].icon;
            var iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;
            var temperature = data.main.temp;
            var windSpeed = data.wind.speed;
            var humidity = data.main.humidity;
            document.getElementById("weather-icon").src = iconUrl;
            document.getElementById("cityName").textContent = "City: " + data.name;
            document.getElementById("temp").textContent = "Temperature: " + temperature + " F";
            document.getElementById("wind").textContent = "Wind: " + windSpeed + " mph";
            document.getElementById("humidity").textContent = "Humidity: " + humidity + " %";
        })
        .catch(function (error) {
            console.log("There was a problem with the fetch operation", error);
        });

    // Fetch and handle the 5-day forecast data.
    fetch(forecastUrl) 
        .then(function (response) {
            if (response.ok) {
                return response.json();
            }   else {
                throw new Error("Network response was not ok: " + response.status);
            }
        })
        .then(function (data) {
            var forecastList = data.list;
            var forecastContainer = document.getElementById("forecast-container");

            forecastContainer.innerHTML = '';

            for (var i = 0; i < forecastList.length; i += 8) {
                var forecastData = forecastList[i];
                var forecastDate = forecastData.dt_txt;
                var forecastTemp = forecastData.main.temp;
                var forecastWindSpeed = forecastData.wind.speed;
                var forecastHumidity = forecastData.main.humidity;
                
                // Forecast cards and append them to the container.
                var card = document.createElement("div");
                card.classList.add("card");
                var dateEl = document.createElement("p");
                dateEl.textContent = "Date: " + forecastDate;

                var tempEl = document.createElement("p");
                tempEl.textContent = "Temperature: " + forecastTemp + "°F";

                var windEl = document.createElement("p");
                windEl.textContent = "Wind: " + forecastWindSpeed + " mph";

                var humidityEl = document.createElement("p");
                humidityEl.textContent = "Humidity: " + forecastHumidity + "%";


                card.appendChild(dateEl);
                card.appendChild(tempEl);
                card.appendChild(windEl);
                card.appendChild(humidityEl);

                forecastContainer.appendChild(card);
            }
        })
        .catch(function (error) {
            console.log("Error:", error);
        });
    // Searched history for the current city.
    saveSearchHistory(cityName);
});

// Function to save search history in local storage.
function saveSearchHistory(cityName) {
    var history = JSON.parse(localStorage.getItem("searchHistory")) || [];
    var maxHistoryEntries = 5;
    
    if (!history.includes(cityName)) {
        history.push(cityName);

        
        if (history.length > maxHistoryEntries) {
            history.shift(); 
        }

        localStorage.setItem("searchHistory", JSON.stringify(history));

        displaySearchHistory();
    }
}

// Function to display the search history.
function displaySearchHistory() {
    var searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
    var searchHistoryContainer = document.getElementById("search-history");

    searchHistoryContainer.innerHTML = '';

    // Create buttons for each search history entry.
    searchHistory.forEach((city) => {
        var historyItem = document.createElement("button");
        historyItem.textContent = city;
        historyItem.classList.add("btn", "btn-success", "d-md-block", "w-100", "mt-2", "mb-2");
        
        // Event listener to load weather data for the selected city.
        historyItem.addEventListener("click", function () {
            getWeatherData(city);
        });
        
        searchHistoryContainer.appendChild(historyItem);
    });
}

// Function to get and display weather data for a specific city.
function getWeatherData(cityName) {
    var apiKey = "ec7ce69200c64e3c1bd5d2c43074fa60";
    var apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=imperial&appid=${apiKey}`;

    fetch(apiUrl)
        .then(function (response) {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error("Network response was not ok: " + response.status);
            }
        })
        .then(function (data) {
            var temperature = data.main.temp;
            var windSpeed = data.wind.speed;
            var humidity = data.main.humidity;
            document.getElementById("cityName").textContent = "City: " + data.name;
            document.getElementById("temp").textContent = "Temperature: " + temperature + " F";
            document.getElementById("wind").textContent = "Wind: " + windSpeed + " mph";
            document.getElementById("humidity").textContent = "Humidity: " + humidity + " %";
        })
        .catch(function (error) {
            console.log("There was a problem with the fetch operation", error);
        });
    
}