async function fetchWeather() {
  const searchInput = document.getElementById("search").value.trim();
  const weatherDataSection = document.getElementById("weather-data");
  const apiKey = "bd01cc69319f5236432fa937e280b95e"; // Replace with your API key or load from environment

  // Check for empty input
  if (!searchInput) {
    weatherDataSection.innerHTML = `
        <div>
          <h2>Empty Input!</h2>
          <p>Please try again with a valid <u>city name</u>.</p>
        </div>
      `;
    weatherDataSection.style.display = "block";
    return;
  }

  weatherDataSection.style.display = "block";

  // Fetch latitude and longitude
  try {
    const geocodeData = await getLonAndLat(searchInput, apiKey);
    if (!geocodeData) return;

    // Fetch weather data using latitude and longitude
    await getWeatherData(geocodeData.lon, geocodeData.lat, apiKey);
  } catch (error) {
    console.log("An error occurred: ", error);
    weatherDataSection.innerHTML = `
        <div>
          <h2>Error Fetching Data</h2>
          <p>Please try again later.</p>
        </div>
      `;
  }

  // Clear the search input
  document.getElementById("search").value = "";
}

// Helper function to get latitude and longitude
async function getLonAndLat(city, apiKey) {
  const geocodeURL = `https://api.openweathermap.org/geo/1.0/direct?q=${city.replace(
    " ",
    "%20"
  )}&limit=1&appid=${apiKey}`;

  const response = await fetch(geocodeURL);
  if (!response.ok) {
    console.log("Bad response! ", response.status);
    return null;
  }

  const data = await response.json();
  if (data.length === 0) {
    document.getElementById("weather-data").innerHTML = `
        <div>
          <h2>Invalid Input: "${city}"</h2>
          <p>Please try again with a valid <u>city name</u>.</p>
        </div>
      `;
    return null;
  }

  return data[0]; // return { lat, lon }
}

// Helper function to get weather data
async function getWeatherData(lon, lat, apiKey) {
  const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;

  const response = await fetch(weatherURL);
  if (!response.ok) {
    console.log("Bad response! ", response.status);
    document.getElementById("weather-data").innerHTML = `
        <div>
          <h2>Error Fetching Weather Data</h2>
          <p>Please try again later.</p>
        </div>
      `;
    return;
  }

  const data = await response.json();

  // Display weather data
  document.getElementById("weather-data").innerHTML = `
      <img src="https://openweathermap.org/img/wn/${
        data.weather[0].icon
      }.png" alt="${data.weather[0].description}" width="100" />
      <div>
        <h2>${data.name}</h2>
        <p><strong>Temperature:</strong> ${Math.round(
          data.main.temp - 273.15
        )}°C</p>
        <p><strong>Description:</strong> ${data.weather[0].description}</p>
      </div>
    `;
}
