// Видалити дублікат імпорту
// const { response } = require("express");

let weatherApi = "/weather";
const weatherForm = document.querySelector("form");
const search = document.querySelector("input");
const weatherIcon = document.querySelector(".weatherIcon i");
const weatherCondition = document.querySelector(".weatherCondition");
const tempElement = document.querySelector(".temperature span");

const locationElement = document.querySelector(".place");
const dateElement = document.querySelector(".date");

const currentDate = new Date();
const options = { month: "long" };
const monthName = currentDate.toLocaleString("en-US", options);
dateElement.textContent = currentDate.getDate() + ", " + monthName;

// Перевірка наявності геолокації
if ("geolocation" in navigator) {
  locationElement.textContent = "Завантаження...";
  navigator.geolocation.getCurrentPosition(
    function (position) {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      const apiUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;
      fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
          // Використовується 'adress' замість 'address'
          if (data && data.adress && data.adress.city) {
            const city = data.adress.city;
            showData(city);
          } else {
            console.log("Місто не знайдено.");
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    function (error) {
      console.log(error.message);
    },
  );
} else {
  console.log("Геолокація недоступна у цьому браузері.");
}

weatherForm.addEventListener("submit", e => {
  e.preventDefault();
  locationElement.textContent = "Завантаження...";
  weatherIcon.className = "";
  tempElement.textContent = "";
  weatherCondition.textContent = "";

  showData(search.value);
});

function showData(city) {
  getWeatherData(city, result => {
    if (result.cod == 200) {
      if (
        result.weather[0].description === "rain" ||
        result.weather[0].description === "fog"
      ) {
        weatherIcon.className = "wi wi-day-" + result.weather[0].description;
      } else {
        weatherIcon.className = "wi wi-day-cloudy";
      }
      locationElement.textContent = result.name;
      tempElement.textContent =
        (result.main.temp - 273.5).toFixed(2) + String.fromCharCode(176);
      weatherCondition.textContent =
        result.weather[0].description.toUpperCase();
    } else {
      locationElement.textContent = "Місто не знайдено";
    }
  });
}

function getWeatherData(city, callback) {
  const locationApi = weatherApi + "?adress=" + city;
  fetch(locationApi).then(response => {
    response.json().then(response => {
      callback(response);
    });
  });
}
