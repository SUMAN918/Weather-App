const userTab = document.querySelector("[dataUserWeather]");
const searchTab = document.querySelector("[dataSearchWeather]");
const userContainer = document.querySelector(".weatherContainer");
const grantAccessContainer = document.querySelector(".grantLocationContainer");
const searchForm = document.querySelector("[dataSearchForm]");
const loadingScreen = document.querySelector(".loadingContainer");
const userInfoContainer = document.querySelector(".userInfoContainer");

let oldTab = userTab;
const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";
oldTab.classList.add("currentTab");


const switchTab = newTab => {
  if (newTab != oldTab) {
    oldTab.classList.remove("currentTab");
    oldTab = newTab;
    oldTab.classList.add("currentTab");

    if (!searchForm.classList.contains("active")) {
      userInfoContainer.classList.remove("active");
      grantAccessContainer.classList.remove("active");
      searchForm.classList.add("active");
    } else {
      searchForm.classList.remove("active");
      userInfoContainer.classList.remove("active");
      getFromSessionStorage();
    }
  }
};

userTab.addEventListener("click", () => {
  switchTab(userTab);
});

searchTab.addEventListener("click", () => {
  switchTab(searchTab);
});

const getFromSessionStorage = () => {
  const localCoordinates = sessionStorage.getItem("user-coordinates");
  if (!localCoordinates) {
    grantAccessContainer.classList.add("active");
  } else {
    const coordinates = JSON.parse(localCoordinates);
    fetchUserWeatherInfo(coordinates);
  }
};

const fetchUserWeatherInfo = async coordinates => {
  const { lat, lon } = coordinates;

  grantAccessContainer.classList.remove("active");
  loadingScreen.classList.add("active");

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );

    const data = await response.json();

    loadingScreen.classList.remove("active");
    userInfoContainer.classList.add("active");
    renderWeatherInfo(data);
  } catch (err) {
    loadingScreen.classList.remove("active");
  }
};

const renderWeatherInfo = (weatherInfo) => {
  const cityName = document.querySelector("[dataCityName]");
  const countryIcon = document.querySelector("[dataCountryIcon]");
  const desc = document.querySelector("[dataWeatherDesc]");
  const weatherIcon = document.querySelector("[dataWeatherIcon]");
  const temp = document.querySelector("[dataTemp]");
  const windSpeed = document.querySelector("[dataWindSpeed]");
  const humidity = document.querySelector("[dataHumidity]");
  const cloudiness = document.querySelector("[dataCloudiness]");

  cityName.innerText = weatherInfo?.name;
  countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
  desc.innerText = weatherInfo?.weather?.[0]?.description;
  weatherIcon.src = `https://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
  temp.innerText = `${weatherInfo?.main?.temp} °C`;
  windSpeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
  humidity.innerText = `${weatherInfo?.main?.humidity} %`;
  cloudiness.innerText = `${weatherInfo?.clouds?.all} %`;
};

const getLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } 
  else {
    alert("No Geolocation Support Available");
  }
};

const showPosition = position => {
  const userCoordinates = {
    lat: position.coords.latitude,
    lon: position.coords.longitude,
  };
  sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
  fetchUserWeatherInfo(userCoordinates);
};

const grantAccessButton = document.querySelector("[dataGrantAccess]");
grantAccessButton.addEventListener("click", getLocation);

const searchInput = document.querySelector("[dataSearchInput]");

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let cityName = searchInput.value;

  if (cityName === "") 
    return;
  else 
    fetchSearchWeatherInfo(cityName);
  // if(searchInput.value === "") return;
  // fetchSearchWeatherInfo(searchInput.value);
});

const fetchSearchWeatherInfo = async city => {
  loadingScreen.classList.add("active");
  userInfoContainer.classList.remove("active");
  grantAccessContainer.classList.remove("active");

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );

    const data = await response.json();

    loadingScreen.classList.remove("active");
    userInfoContainer.classList.add("active");
    renderWeatherInfo(data);
  } 
  catch(err) {
      
  }
};
