let currentCity = "State of Punjab";
let units = "metric";
let intervalId;

const weatherApp = document.querySelector(".weather-app");
const cityName = document.querySelector(".weather-city");
const datetime = document.querySelector(".weather-datetime");
const weatherForecast = document.querySelector(".weather-forecast");
const weatherIcon = document.querySelector(".weather-icon");
const weatherTemperature = document.querySelector(".weather-temperature");
const weatherMinMax = document.querySelector(".weather-minmax");
const weatherRealfeel = document.querySelector(".weather-realfeel");
const weatherHumidity = document.querySelector(".weather-humidity");
const weatherWind = document.querySelector(".weather-wind");
const weatherPressure = document.querySelector(".weather-pressure");

document
  .querySelector(".weather-search")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const searchCity = document.querySelector(".weather-search-form").value;
    if (searchCity) {
      currentCity = searchCity;
      await getWeatherData();
      document.querySelector(".weather-search-form").value = "";
    }
  });

document
  .querySelector(".weather-unit-celsius")
  .addEventListener("click", async () => {
    if (units !== "metric") {
      units = "metric";
      await getWeatherData();
    }
  });

document
  .querySelector(".weather-unit-farenheit")
  .addEventListener("click", async () => {
    if (units !== "imperial") {
      units = "imperial";
      await getWeatherData();
    }
  });

const updateDateTime = (timezone) => {
  clearInterval(intervalId);
  const convertTimeZone = timezone / 3600;
  const date = new Date();

  date.setUTCHours(date.getUTCHours() + Math.floor(convertTimeZone));
  date.setUTCMinutes(
    date.getUTCMinutes() + Math.abs(Math.floor((convertTimeZone % 1) * 60))
  );

  const offsetString = `${convertTimeZone >= 0 ? "-" : "+"}${Math.abs(
    date.getUTCHours()
  )
    .toString()
    .padStart(2, "0")}:${date.getUTCMinutes().toString().padStart(2, "0")}`;

  const options = {
    weekday: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    timeZone: "UTC",
    timeZoneName: "short",
  };

  datetime.textContent = date
    .toLocaleString("en-US", options)
    .replace("GMT", `GMT${offsetString}`);

  intervalId = setInterval(() => {
    updateDateTime(timezone);
  }, 1000);
};

const getWeatherData = async () => {
  const API = "8accac751215bf1f3ed1089e37902b74";

  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${currentCity}&appid=${API}&units=${units}`
  );
  const responseData = await response.json();
  console.log(responseData);

  if (response.ok) {
    // Response is valid, update UI with current weather data
    if (responseData.name && responseData.sys && responseData.sys.country) {
      cityName.textContent = `${responseData.name}, ${responseData.sys.country}`;
    }

    updateDateTime(responseData.timezone);

    if (responseData.weather) {
      const weatherCondition = responseData.weather[0].main;
      // Update background based on weather condition
      if (weatherCondition === "Clear") {
        weatherApp.style.backgroundImage =
          "url('https://weather-app-website.vercel.app/img/clear.9043eaf5.jpg')";
      } else if (weatherCondition === "Clouds") {
        weatherApp.style.backgroundImage =
          "url('https://weather-app-website.vercel.app/img/clouds.08c95c99.jpg')";
      } else if (weatherCondition === "Rain") {
        weatherApp.style.backgroundImage =
          "url('https://images.unsplash.com/photo-1626526489043-b4eff83bc91e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80')";
      } else if (weatherCondition === "Haze") {
        weatherApp.style.backgroundImage =
          "url('https://images.pexels.com/photos/4324492/pexels-photo-4324492.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')";
      } else if (weatherCondition === "Mist") {
        weatherApp.style.backgroundImage =
          "url('https://images.unsplash.com/photo-1506795593475-bac1181c01a5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80')";
      }
    }

    // Update weather details
    if (responseData.main) {
      weatherTemperature.textContent = `${responseData.main.temp.toFixed()}°`;
      weatherMinMax.textContent = `Min: ${responseData.main.temp_min.toFixed()}°C Max: ${responseData.main.temp_max.toFixed()}°C`;
      weatherRealfeel.textContent = `${responseData.main.feels_like.toFixed()}°`;
      weatherHumidity.textContent = `${responseData.main.humidity.toFixed()}%`;
    }

    if (responseData.wind) {
      weatherWind.textContent = `${responseData.wind.deg.toFixed()} m/s`;
    }

    if (responseData.main) {
      weatherPressure.textContent = `${responseData.main.pressure.toFixed()} hPa`;
    }

    if (responseData.weather && responseData.weather[0]) {
      weatherForecast.textContent = responseData.weather[0].description;
      weatherIcon.innerHTML = `<img src="http://openweathermap.org/img/wn/${responseData.weather[0].icon}.png" />`;
    }
  } else {
    // Handle the case when the response is not OK (city not found)
    // Set the date to the previous day
    const previousDay = new Date();
    previousDay.setDate(previousDay.getDate());
  }
};

document.addEventListener("DOMContentLoaded", async () => {
  await getWeatherData();
});
