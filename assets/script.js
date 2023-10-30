var apiKey = "ec7ce69200c64e3c1bd5d2c43074fa60";

var searchForm = document.getElementById("search-form");
var cityInput = document.getElementById("city-input");
var submitButton = document.getElementById("submit-btn");

submitButton.addEventListener("click", function (e) {
    e.preventDefault();
    var cityName = cityInput.value;
    var apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=imperial&appid=${apiKey}`;
    var forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=imperial&appid=${apiKey}`;

    fetch(apiUrl)
        .then(function (response) {
            if (response.ok) {
                return response.json();
            } else {
              throw new Error("Network response was not ok: " + response.status);
            }
        })
        .then(function (data){
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

    saveSearchHistory(cityName);
});

function saveSearchHistory(cityName) {
    var history = JSON.parse(localStorage.getItem("searchHistory")) || [];

    if (!history.includes(cityName)) {
        history.push(cityName);

        var maxHistoryEntries = 10;
        if (history.length > maxHistoryEntries) {
            history.shift(); 
        }

        localStorage.setItem("searchHistory", JSON.stringify(history));

        //displaySearchHistory();
    }
}

function displaySearchHistory() {
    var searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
    var searchHistoryContainer = document.getElementById("search-history");

    searchHistoryContainer.innerHTML = '';

    searchHistory.forEach((city) => {
        var historyItem = document.createElement("button");
        historyItem.textContent = city;
        historyItem.classList.add("btn", "btn-success", ".d-md-block", "w-100", "mb-10");
        
        historyItem.addEventListener("click", function () {
            historyItem(city);
        });
        
        searchHistoryContainer.appendChild(historyItem);
    });
}