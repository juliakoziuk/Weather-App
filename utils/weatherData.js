const request = require("request");

const openWeatherMap = {
  BASE_URL: "https://api.openweathermap.org/data/2.5/weather?q=",
  SECRET_KEY: "dae8f6e6f597bf7e82660d171f26bf4e",
};

const weatherData = (adress, callback) => {
  const url =
    openWeatherMap.BASE_URL +
    encodeURIComponent(adress) +
    "&APPID=" +
    openWeatherMap.SECRET_KEY;
  console.log(url);
  request({ url, json: true }, (error, data) => {
    if (error) {
      callback(true, "Unable to fetch data, please try again" + error);
    }
    callback(false, data?.body);
  });
};

module.exports = weatherData;
