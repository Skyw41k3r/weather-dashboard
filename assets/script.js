var searchCityForm = document.querySelector("#city-form");
var searchCityEl = document.querySelector("#find-city");
var searchButton = document.querySelector("#searchbtn");
var citySearchEl = document.querySelector("#searched-city")
var weatherContainer = document.querySelector("#weather-div");
var forecastDisplay = document.querySelector("#forecast-now");
var APIKey = 'dd81a6b7086f366060794f2af941e0e8';
var currentDay = moment().format('l');
var fiveDayContainer = document.querySelector("#container-five-forecast");
var historySearchButton = document.querySelector("#search-history-buttons");
var allCities = [];


function searchSubmit(event) {
    event.preventDefault();
    var city = searchCityEl.value;
    console.log(city);
    if (!city) {
        alert("Please enter a city!");
        return;
    }
    getWeather(city);
    fetchFiveDay(city);
    savedCities();
    cityHistory(city);
}

function getWeather(city) {
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + APIKey;
    fetch(queryURL)
        .then(function(response) {
            console.log(response);
            return response.json();
        })
        .then(function(data) {
            console.log(data);
            displayCurrentWeather(data, city);
        })
        .catch(function(error) {
            console.log(error);
        })
};

function displayCurrentWeather(weather, searchedCity) {
    weatherContainer.textContent = "";
    citySearchEl.textContent = searchedCity;

    console.log(weather);

    var currentDate = document.createElement("span")
    currentDate.textContent = " (" + moment(weather.dt.value).format("l") + ") ";
    citySearchEl.appendChild(currentDate);

    var weatherIcon = document.createElement("img")
    weatherIcon.setAttribute("src", `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`);
    citySearchEl.appendChild(weatherIcon);

    var tempEl = document.createElement("span");
    tempEl.textContent = "Temperature: " + weather.main.temp + "°F";
    tempEl.classList = "list-group-item"

    var humidityEl = document.createElement("span");
    humidityEl.textContent = "Humidity: " + weather.main.humidity + "%";
    humidityEl.classList = "list-group-item"

    var windSpeedEl = document.createElement("span");
    windSpeedEl.textContent = "Wind Speed: " + weather.wind.speed + " mph";
    windSpeedEl.classList = "list-group-item"

    weatherContainer.appendChild(tempEl);
    weatherContainer.appendChild(humidityEl);
    weatherContainer.appendChild(windSpeedEl);

    var lat = weather.coord.lat;
    var lon = weather.coord.lon;
    getUvStatus(lat, lon)
}

function getUvStatus(lat, lon) {
    var apiKey = "dd81a6b7086f366060794f2af941e0e8"
    var apiURL = `https://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${lat}&lon=${lon}`;
    fetch(apiURL)
        .then(function(response) {
            response.json().then(function(data) {
                showUvIndex(data)
            })
        })
}

function showUvIndex(index) {
    var uvIndex = document.createElement("div");
    uvIndex.textContent = "UV Index: "
    uvIndex.classList = "list-group-item"
    indexValue = document.createElement("span")
    indexValue.textContent = index.value

    if (index.value <= 2) {
        indexValue.classList = "favorable"
    } else if (index.value > 2 && index.value <= 8) {
        indexValue.classList = "moderate"
    } else if (index.value > 8) {
        indexValue.classList = "severe"
    };
    uvIndex.appendChild(indexValue);
    weatherContainer.appendChild(uvIndex);
};

function fetchFiveDay(city) {
    var apiKey = "dd81a6b7086f366060794f2af941e0e8"
    var apiURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`;
    fetch(apiURL)
        .then(function(response) {
            response.json().then(function(data) {
                showFiveDay(data);
                console.log(data);
            })
        })
};

function showFiveDay(weather) {
    fiveDayContainer.textContent = "";
    forecastDisplay.textContent = "5-Day Forecast:";
    var forecastCurrent = weather.list;
    for (var i = 4; i < forecastCurrent.length; i = i + 8) {
        var dayForecast = forecastCurrent[i];

        var forecastEL = document.createElement("div");
        forecastEL.classList = "card bg-primary text-light m-2";
        var currentForecastDate = document.createElement("h4")
        currentForecastDate.textContent = moment.unix(dayForecast.dt).format("l");
        currentForecastDate.classList = "card-header text-center"
        forecastEL.appendChild(currentForecastDate);

        var weatherIcon = document.createElement("img")
        weatherIcon.classList = "card-body text-center"
        weatherIcon.setAttribute("src", `https://openweathermap.org/img/wn/${dayForecast.weather[0].icon}@2x.png`);
        forecastEL.appendChild(weatherIcon);

        var forecastTemp = document.createElement("span");
        forecastTemp.textContent = "Temp: " + dayForecast.main.temp + "°F";
        forecastTemp.classList = "card-body text-center"
        forecastEL.appendChild(forecastTemp);

        var forecastHumidity = document.createElement("span");
        forecastHumidity.textContent = "Humidity: " + dayForecast.main.humidity + "%";
        forecastHumidity.classList = "card-body text-center"
        forecastEL.appendChild(forecastHumidity);


        var forecastWind = document.createElement("span");
        forecastWind.textContent = "Wind: " + dayForecast.wind.speed + " mph";
        forecastWind.classList = "card-body text-center"
        forecastEL.appendChild(forecastWind);

        fiveDayContainer.appendChild(forecastEL);
    }
}

function savedCities() {
    localStorage.setItem("cities", JSON.stringify(allCities));
}


function cityHistory(cityHistory) {
    historySearchEL = document.createElement("button");
    historySearchEL.textContent = cityHistory;
    historySearchEL.classList = " d-flex w-100 btn-outline-primary border p-2";
    historySearchEL.setAttribute("city-data", cityHistory)
    historySearchEL.setAttribute("type", "submit");
    historySearchButton.prepend(historySearchEL);
}

function historySubmit(event) {
    var city = event.target.getAttribute("city-data")
    if (city) {
        getWeather(city);
        fetchFiveDay(city);
    }
}

searchButton.addEventListener("click", searchSubmit);
historySearchButton.addEventListener("click", historySubmit);