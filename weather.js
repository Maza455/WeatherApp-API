const weatherForm = document.getElementById('weather-form');
const locationInput = document.getElementById('location-input');
const weatherData = document.getElementById('weather-data');

let weatherDataArray = JSON.parse(localStorage.getItem('weatherData')) || [];

function saveWeatherData() {
  localStorage.setItem('weatherData', JSON.stringify(weatherDataArray));
}

function deleteWeatherData(index) {
  weatherDataArray.splice(index, 1);

  saveWeatherData();

  displayWeatherData();
}

function displayWeatherData() {
    weatherData.innerHTML = '';
  
    weatherDataArray.forEach((item, index) => {
      const weatherDataItem = document.createElement('div');
      weatherDataItem.innerHTML = `
        ${item.condition && item.condition.id ? `<i class="wi wi-owm-${item.condition.id}"></i>` : ''}
        <span>${item.location}</span>
        <span>${item.temperature} °C</span>
        <button data-index="${index}">Delete</button>
      `;
      weatherData.appendChild(weatherDataItem);
    });
  
    const deleteButtons = document.querySelectorAll('#weather-data button');
    deleteButtons.forEach((button) => {
      button.addEventListener('click', (event) => {
        const index = event.target.getAttribute('data-index');
        deleteWeatherData(index);
      });
    });
  }
  

function showAlert(message) {
  const alert = document.createElement('div');
  alert.classList.add('alert');
  alert.textContent = message;
  weatherForm.appendChild(alert);
  setTimeout(() => {
    alert.remove();
  }, 3000);
}

async function getWeatherData(location) {
    try {
  
      const API_KEY = 'fd3e6bedc8f3073466c804601bc4614a';
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${API_KEY}&units=metric`);
      const data = await response.json();
  
      if (data.cod === '404') {
        alert('Location not found. Please enter a valid location.');
      } else {
        const existingIndex = weatherDataArray.findIndex(item => item.location === data.name);
        if (existingIndex > -1) {
          weatherDataArray[existingIndex].temperature = data.main.temp;
        } else {
          weatherDataArray.push({
            location: data.name,
            temperature: data.main.temp,
            condition: data.weather[0]
          });
        }
  
        saveWeatherData();
  
        displayWeatherData();
      }
    } catch (error) {
      console.error(error);
    }
  }
  

weatherForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const location = locationInput.value.trim();
  if (location !== '') {
    getWeatherData(location);
    locationInput.value = '';
  } else {
    alert('Please enter a location.');
  }
});

displayWeatherData();
