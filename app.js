/**
 * Professional Weather Web Application (Atmosphere)
 * Connects to Open-Meteo and OpenStreetMap Nominatim APIs
 */

// Weather Code Definitions & Icons
const WEATHER_CONFIG = {
  0: { text: "Clear Sky", icon: "sun", dayClass: "weather-clear-day", nightClass: "weather-clear-night" },
  1: { text: "Mainly Clear", icon: "sun-cloud", dayClass: "weather-clear-day", nightClass: "weather-clear-night" },
  2: { text: "Partly Cloudy", icon: "cloud-sun", dayClass: "weather-clouds", nightClass: "weather-clouds" },
  3: { text: "Overcast", icon: "cloud", dayClass: "weather-clouds", nightClass: "weather-clouds" },
  45: { text: "Fog", icon: "fog", dayClass: "weather-clouds", nightClass: "weather-clouds" },
  48: { text: "Depositing Rime Fog", icon: "fog", dayClass: "weather-clouds", nightClass: "weather-clouds" },
  51: { text: "Light Drizzle", icon: "drizzle", dayClass: "weather-rain", nightClass: "weather-rain" },
  53: { text: "Moderate Drizzle", icon: "drizzle", dayClass: "weather-rain", nightClass: "weather-rain" },
  55: { text: "Heavy Drizzle", icon: "drizzle", dayClass: "weather-rain", nightClass: "weather-rain" },
  56: { text: "Light Freezing Drizzle", icon: "sleet", dayClass: "weather-snow", nightClass: "weather-snow" },
  57: { text: "Dense Freezing Drizzle", icon: "sleet", dayClass: "weather-snow", nightClass: "weather-snow" },
  61: { text: "Light Rain", icon: "rain-light", dayClass: "weather-rain", nightClass: "weather-rain" },
  63: { text: "Moderate Rain", icon: "rain-moderate", dayClass: "weather-rain", nightClass: "weather-rain" },
  65: { text: "Heavy Rain", icon: "rain-heavy", dayClass: "weather-rain", nightClass: "weather-rain" },
  66: { text: "Light Freezing Rain", icon: "sleet", dayClass: "weather-snow", nightClass: "weather-snow" },
  67: { text: "Heavy Freezing Rain", icon: "sleet", dayClass: "weather-snow", nightClass: "weather-snow" },
  71: { text: "Light Snow Fall", icon: "snow-light", dayClass: "weather-snow", nightClass: "weather-snow" },
  73: { text: "Moderate Snow Fall", icon: "snow-moderate", dayClass: "weather-snow", nightClass: "weather-snow" },
  75: { text: "Heavy Snow Fall", icon: "snow-heavy", dayClass: "weather-snow", nightClass: "weather-snow" },
  77: { text: "Snow Grains", icon: "snow-light", dayClass: "weather-snow", nightClass: "weather-snow" },
  80: { text: "Rain Showers", icon: "showers", dayClass: "weather-rain", nightClass: "weather-rain" },
  81: { text: "Moderate Rain Showers", icon: "showers", dayClass: "weather-rain", nightClass: "weather-rain" },
  82: { text: "Violent Rain Showers", icon: "showers", dayClass: "weather-rain", nightClass: "weather-rain" },
  85: { text: "Slight Snow Showers", icon: "snow-light", dayClass: "weather-snow", nightClass: "weather-snow" },
  86: { text: "Heavy Snow Showers", icon: "snow-heavy", dayClass: "weather-snow", nightClass: "weather-snow" },
  95: { text: "Thunderstorm", icon: "thunderstorm", dayClass: "weather-thunderstorm", nightClass: "weather-thunderstorm" },
  96: { text: "Thunderstorm with Slight Hail", icon: "thunderstorm", dayClass: "weather-thunderstorm", nightClass: "weather-thunderstorm" },
  99: { text: "Thunderstorm with Heavy Hail", icon: "thunderstorm", dayClass: "weather-thunderstorm", nightClass: "weather-thunderstorm" }
};

// SVG Weather Icons Library
function getWeatherSVG(type, isDay = 1) {
  const icons = {
    "sun": `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" class="weather-svg" aria-hidden="true">
      <circle cx="32" cy="32" r="14" fill="url(#sun-grad)"/>
      <g stroke="#ffb703" stroke-width="3.5" stroke-linecap="round">
        <line x1="32" y1="6" x2="32" y2="12"/>
        <line x1="32" y1="52" x2="32" y2="58"/>
        <line x1="6" y1="32" x2="12" y2="32"/>
        <line x1="52" y1="32" x2="58" y2="32"/>
        <line x1="13.6" y1="13.6" x2="17.8" y2="17.8"/>
        <line x1="46.2" y1="46.2" x2="50.4" y2="50.4"/>
        <line x1="13.6" y1="50.4" x2="17.8" y2="46.2"/>
        <line x1="46.2" y1="17.8" x2="50.4" y2="13.6"/>
      </g>
      <defs>
        <radialGradient id="sun-grad" cx="0.3" cy="0.3" r="0.7">
          <stop offset="0%" stop-color="#fff3b0"/>
          <stop offset="100%" stop-color="#fb8500"/>
        </radialGradient>
      </defs>
    </svg>`,
    "moon": `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" class="weather-svg" aria-hidden="true">
      <path d="M44 38C44 48 35.5 56 25 56C19 56 13.7 53 10 48.5C12 49 14.2 49.5 16.5 49.5C28.5 49.5 38 39.8 38 28C38 20.8 34.5 14.5 29 10.5C37.5 12 44 20 44 38Z" fill="url(#moon-grad)"/>
      <circle cx="48" cy="18" r="1.5" fill="#f8fafc"/>
      <circle cx="54" cy="28" r="1" fill="#cbd5e1"/>
      <circle cx="42" cy="12" r="1" fill="#cbd5e1"/>
      <defs>
        <linearGradient id="moon-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#f8fafc"/>
          <stop offset="100%" stop-color="#94a3b8"/>
        </linearGradient>
      </defs>
    </svg>`,
    "cloud-sun": `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" class="weather-svg" aria-hidden="true">
      <circle cx="24" cy="24" r="11" fill="url(#sun-mini)"/>
      <path d="M22 50H46C51.5 50 56 45.5 56 40C56 34.8 52 30.5 47 30.1C46 22 39 16 30.5 16C23 16 16.8 20.8 15 27.5C9.5 28.5 5.5 33.3 5.5 39C5.5 45 10.5 50 16.5 50H22Z" fill="url(#cloud-grad)"/>
      <defs>
        <radialGradient id="sun-mini" cx="0.3" cy="0.3" r="0.7">
          <stop offset="0%" stop-color="#fff3b0"/>
          <stop offset="100%" stop-color="#fb8500"/>
        </radialGradient>
        <linearGradient id="cloud-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#ffffff"/>
          <stop offset="100%" stop-color="#94a3b8"/>
        </linearGradient>
      </defs>
    </svg>`,
    "cloud": `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" class="weather-svg" aria-hidden="true">
      <path d="M19 50H47C52.5 50 57 45.5 57 40C57 34.8 53 30.5 48 30.1C47 21 39.5 14 30 14C21.8 14 15 19.5 13 27C7 28 2.5 33.2 2.5 39.5C2.5 45.3 7.2 50 13 50H19Z" fill="url(#cloud-dark-grad)"/>
      <defs>
        <linearGradient id="cloud-dark-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#e2e8f0"/>
          <stop offset="100%" stop-color="#64748b"/>
        </linearGradient>
      </defs>
    </svg>`,
    "rain-light": `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" class="weather-svg" aria-hidden="true">
      <path d="M18 40H46C51 40 55 36 55 31C55 26.5 51.5 23 47 22.5C46 15 39.5 9 31 9C23.5 9 17.5 14 15.5 20.5C10 21.5 6 26 6 31.5C6 36.2 10 40 15 40H18Z" fill="url(#cloud-rain)"/>
      <line x1="22" y1="46" x2="18" y2="56" stroke="#38bdf8" stroke-width="3" stroke-linecap="round"/>
      <line x1="34" y1="46" x2="30" y2="56" stroke="#38bdf8" stroke-width="3" stroke-linecap="round"/>
      <line x1="46" y1="46" x2="42" y2="56" stroke="#38bdf8" stroke-width="3" stroke-linecap="round"/>
      <defs>
        <linearGradient id="cloud-rain" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#cbd5e1"/>
          <stop offset="100%" stop-color="#475569"/>
        </linearGradient>
      </defs>
    </svg>`,
    "rain-heavy": `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" class="weather-svg" aria-hidden="true">
      <path d="M18 36H46C51 36 55 32 55 27C55 22.5 51.5 19 47 18.5C46 11 39.5 5 31 5C23.5 5 17.5 10 15.5 16.5C10 17.5 6 22 6 27.5C6 32.2 10 36 15 36H18Z" fill="url(#cloud-heavy)"/>
      <line x1="20" y1="42" x2="14" y2="58" stroke="#0ea5e9" stroke-width="3.5" stroke-linecap="round"/>
      <line x1="32" y1="42" x2="26" y2="58" stroke="#0ea5e9" stroke-width="3.5" stroke-linecap="round"/>
      <line x1="44" y1="42" x2="38" y2="58" stroke="#0ea5e9" stroke-width="3.5" stroke-linecap="round"/>
      <defs>
        <linearGradient id="cloud-heavy" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#94a3b8"/>
          <stop offset="100%" stop-color="#334155"/>
        </linearGradient>
      </defs>
    </svg>`,
    "snow-moderate": `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" class="weather-svg" aria-hidden="true">
      <path d="M18 38H46C51 38 55 34 55 29C55 24.5 51.5 21 47 20.5C46 13 39.5 7 31 7C23.5 7 17.5 12 15.5 18.5C10 19.5 6 24 6 29.5C6 34.2 10 38 15 38H18Z" fill="url(#cloud-snow)"/>
      <circle cx="22" cy="48" r="2.5" fill="#e0f2fe"/>
      <circle cx="34" cy="54" r="3" fill="#e0f2fe"/>
      <circle cx="44" cy="46" r="2.5" fill="#e0f2fe"/>
      <circle cx="24" cy="58" r="2" fill="#e0f2fe"/>
      <defs>
        <linearGradient id="cloud-snow" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#e2e8f0"/>
          <stop offset="100%" stop-color="#64748b"/>
        </linearGradient>
      </defs>
    </svg>`,
    "thunderstorm": `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" class="weather-svg" aria-hidden="true">
      <path d="M18 36H46C51 36 55 32 55 27C55 22.5 51.5 19 47 18.5C46 11 39.5 5 31 5C23.5 5 17.5 10 15.5 16.5C10 17.5 6 22 6 27.5C6 32.2 10 36 15 36H18Z" fill="url(#cloud-thunder)"/>
      <polygon points="32,36 24,48 31,48 27,62 41,46 34,46" fill="#facc15"/>
      <defs>
        <linearGradient id="cloud-thunder" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#475569"/>
          <stop offset="100%" stop-color="#1e293b"/>
        </linearGradient>
      </defs>
    </svg>`,
    "fog": `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" class="weather-svg" aria-hidden="true">
      <path d="M18 28H46C51 28 55 24 55 19C55 14.5 51.5 11 47 10.5C46 5 39.5 1 31 1C23.5 1 17.5 5 15.5 10.5C10 11.5 6 15.5 6 20.5C6 24.5 10 28 15 28H18Z" fill="url(#cloud-fog)"/>
      <line x1="12" y1="36" x2="52" y2="36" stroke="#94a3b8" stroke-width="3.5" stroke-linecap="round"/>
      <line x1="18" y1="44" x2="46" y2="44" stroke="#94a3b8" stroke-width="3.5" stroke-linecap="round"/>
      <line x1="14" y1="52" x2="50" y2="52" stroke="#94a3b8" stroke-width="3.5" stroke-linecap="round"/>
      <defs>
        <linearGradient id="cloud-fog" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#cbd5e1"/>
          <stop offset="100%" stop-color="#64748b"/>
        </linearGradient>
      </defs>
    </svg>`
  };

  if (!isDay && (type === "sun" || type === "sun-cloud")) {
    return icons["moon"];
  }
  if (type === "sun") return icons["sun"];
  if (type === "sun-cloud" || type === "cloud-sun") return icons["cloud-sun"];
  if (type === "cloud") return icons["cloud"];
  if (type === "fog") return icons["fog"];
  if (type.includes("rain") || type === "drizzle" || type === "showers") {
    return type.includes("heavy") || type === "showers" ? icons["rain-heavy"] : icons["rain-light"];
  }
  if (type.includes("snow") || type === "sleet") return icons["snow-moderate"];
  if (type.includes("thunderstorm")) return icons["thunderstorm"];

  return icons["sun"];
}

// App State
const state = {
  currentUnit: 'c', // 'c' or 'f'
  currentLocation: null,
  currentWeatherData: null,
  map: null,
  mapMarker: null,
  debounceTimer: null,
  resizeDebounceTimer: null
};

// DOM Elements
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const gpsBtn = document.getElementById("gps-btn");
const autocompleteBox = document.getElementById("autocomplete-results");
const loadingOverlay = document.getElementById("loading-overlay");
const toast = document.getElementById("toast");
const unitCBtn = document.getElementById("unit-c");
const unitFBtn = document.getElementById("unit-f");
const quickChips = document.querySelectorAll(".chip-btn");

// Temperature Conversion Helpers
function toDisplayTemp(celsius) {
  if (celsius === undefined || celsius === null || isNaN(celsius)) return "--";
  if (state.currentUnit === 'f') {
    return Math.round((celsius * 9) / 5 + 32);
  }
  return Math.round(celsius);
}

function getTempUnit() {
  return state.currentUnit === 'f' ? '°F' : '°C';
}

function toDisplaySpeed(kmh) {
  if (kmh === undefined || kmh === null || isNaN(kmh)) return "--";
  if (state.currentUnit === 'f') {
    return (kmh * 0.621371).toFixed(1) + " mph";
  }
  return kmh.toFixed(1) + " km/h";
}

// Show Toast Notification
function showToast(msg) {
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 4000);
}

// Loading Spinner Overlay
function setLoading(isLoading) {
  if (!loadingOverlay) return;
  if (isLoading) {
    loadingOverlay.classList.add("active");
  } else {
    loadingOverlay.classList.remove("active");
  }
}

// Fetch Location by query (Open-Meteo Geocoding primary, Nominatim fallback)
async function searchLocation(query) {
  if (!query || query.trim().length === 0) return [];
  const clean = query.trim();

  // 1. Try Open-Meteo Geocoding API
  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(clean)}&count=5&language=en&format=json`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      if (data.results && data.results.length > 0) {
        return data.results.map(r => ({
          name: [r.name, r.admin1, r.country].filter(Boolean).join(", "),
          title: r.name,
          subtitle: [r.admin1, r.country].filter(Boolean).join(", "),
          countryCode: r.country_code || "",
          lat: r.latitude,
          lon: r.longitude,
          timezone: r.timezone || "auto"
        }));
      }
    }
  } catch (err) {
    console.warn("Open-Meteo geocoding fallback triggering:", err);
  }

  // 2. Fallback to OpenStreetMap Nominatim
  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(clean)}&format=json&limit=5&addressdetails=1`;
    const res = await fetch(url, { headers: { "Accept-Language": "en" } });
    if (res.ok) {
      const data = await res.json();
      if (data && data.length > 0) {
        return data.map(d => ({
          name: d.display_name,
          title: d.name || d.display_name.split(",")[0],
          subtitle: d.display_name.split(",").slice(1, 3).join(","),
          countryCode: d.address?.country_code?.toUpperCase() || "",
          lat: parseFloat(d.lat),
          lon: parseFloat(d.lon),
          timezone: "auto"
        }));
      }
    }
  } catch (err) {
    console.error("Nominatim geocode failed:", err);
  }

  return [];
}

// Fetch Weather Data from Open-Meteo
async function fetchWeatherData(lat, lon, timezone = "auto") {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,surface_pressure,wind_speed_10m,wind_direction_10m,weather_code,is_day,precipitation,uv_index&hourly=temperature_2m,weather_code,precipitation_probability,is_day&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum,uv_index_max&timezone=${encodeURIComponent(timezone)}`;
  
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch weather data.");
  return await res.json();
}

// Update Dynamic Theme based on weather and time
function applyWeatherTheme(code, isDay) {
  const conf = WEATHER_CONFIG[code] || WEATHER_CONFIG[0];
  const className = isDay ? conf.dayClass : conf.nightClass;
  document.body.className = className;
}

// Parse ISO date string safely across all browsers
function parseDateSafe(isoStr) {
  if (!isoStr) return new Date();
  return new Date(isoStr.replace(' ', 'T'));
}

// Render All UI Components
function renderWeatherDashboard(loc, data) {
  state.currentLocation = loc;
  state.currentWeatherData = data;

  const current = data.current;
  const daily = data.daily;
  const hourly = data.hourly;

  const weatherInfo = WEATHER_CONFIG[current.weather_code] || { text: "Unknown", icon: "sun" };

  // 1. Apply Theme
  applyWeatherTheme(current.weather_code, current.is_day);

  // 2. Hero Weather Header
  document.getElementById("location-title").textContent = loc.title || loc.name.split(",")[0];
  document.getElementById("location-country").textContent = loc.subtitle || loc.name;
  document.getElementById("coord-lat").textContent = loc.lat.toFixed(4) + "°N";
  document.getElementById("coord-lon").textContent = loc.lon.toFixed(4) + "°E";

  const gmapsLink = `https://www.google.com/maps?q=${loc.lat},${loc.lon}`;
  document.getElementById("gmaps-link").href = gmapsLink;
  document.getElementById("map-embed-link").href = gmapsLink;

  // 3. Hero Temperature & Conditions
  document.getElementById("current-temp").textContent = toDisplayTemp(current.temperature_2m);
  document.getElementById("current-unit").textContent = getTempUnit();
  document.getElementById("condition-text").textContent = weatherInfo.text;
  document.getElementById("hero-weather-icon").innerHTML = getWeatherSVG(weatherInfo.icon, current.is_day);
  
  const obsDate = parseDateSafe(current.time);
  document.getElementById("observation-time").textContent = obsDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // 4. Hero Footer Mini-Stats
  document.getElementById("today-max").textContent = `${toDisplayTemp(daily.temperature_2m_max[0])}${getTempUnit()}`;
  document.getElementById("today-min").textContent = `${toDisplayTemp(daily.temperature_2m_min[0])}${getTempUnit()}`;
  document.getElementById("feels-like-hero").textContent = `${toDisplayTemp(current.apparent_temperature)}${getTempUnit()}`;
  document.getElementById("wind-hero").textContent = toDisplaySpeed(current.wind_speed_10m);

  // 5. Detailed Metric Cards
  document.getElementById("metric-feels").textContent = toDisplayTemp(current.apparent_temperature);
  document.getElementById("metric-feels-unit").textContent = getTempUnit();
  const tempDiff = current.apparent_temperature - current.temperature_2m;
  document.getElementById("metric-feels-status").textContent = 
    Math.abs(tempDiff) < 1.5 ? "Similar to actual temperature" :
    tempDiff > 0 ? "Feels warmer due to humidity" : "Feels colder due to wind chill";

  document.getElementById("metric-humidity").textContent = current.relative_humidity_2m ?? "--";
  document.getElementById("metric-humidity-status").textContent = 
    current.relative_humidity_2m < 30 ? "Dry air condition" :
    current.relative_humidity_2m > 70 ? "High moisture / humid" : "Pleasant and comfortable";

  document.getElementById("metric-wind").textContent = toDisplaySpeed(current.wind_speed_10m);
  document.getElementById("metric-wind-dir").textContent = `Direction: ${current.wind_direction_10m ?? 0}°`;

  document.getElementById("metric-pressure").textContent = current.surface_pressure ? Math.round(current.surface_pressure) : "--";
  document.getElementById("metric-uv").textContent = current.uv_index !== undefined ? current.uv_index.toFixed(1) : (daily.uv_index_max[0] ? daily.uv_index_max[0].toFixed(1) : "--");

  const uv = current.uv_index || daily.uv_index_max[0] || 0;
  document.getElementById("metric-uv-status").textContent = 
    uv <= 2 ? "Low risk (No protection needed)" :
    uv <= 5 ? "Moderate (Wear sunglasses & SPF)" :
    uv <= 7 ? "Very High (Avoid direct midday sun)" : "Extreme (Stay in shade)";

  // 6. Sunrise & Sunset Cycle
  const sunriseDate = parseDateSafe(daily.sunrise[0]);
  const sunsetDate = parseDateSafe(daily.sunset[0]);

  document.getElementById("sunrise-time").textContent = sunriseDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  document.getElementById("sunset-time").textContent = sunsetDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Calculate daylight percentage
  const now = new Date();
  const totalDaylight = sunsetDate - sunriseDate;
  const elapsedDaylight = now - sunriseDate;
  let dayPercent = 0;
  if (now < sunriseDate) dayPercent = 0;
  else if (now > sunsetDate) dayPercent = 100;
  else dayPercent = Math.min(100, Math.max(0, Math.round((elapsedDaylight / totalDaylight) * 100)));

  document.getElementById("daylight-fill").style.width = `${dayPercent}%`;
  document.getElementById("daylight-status-text").textContent = 
    now < sunriseDate ? "Before sunrise" :
    now > sunsetDate ? "Sun has set" : `${dayPercent}% daylight completed`;

  // 7. Hourly Forecast (Next 24 Hours)
  renderHourlyForecast(hourly);

  // 8. 7-Day Extended Forecast
  renderDailyForecast(daily);

  // 9. Update Interactive Leaflet Map
  updateMap(loc.lat, loc.lon, loc.title || loc.name, toDisplayTemp(current.temperature_2m) + getTempUnit());
}

// Render Hourly Slider
function renderHourlyForecast(hourly) {
  const container = document.getElementById("hourly-container");
  if (!container) return;
  container.innerHTML = "";

  const now = new Date();
  const currentIsoHour = now.toISOString().slice(0, 13);

  let startIndex = 0;
  for (let i = 0; i < hourly.time.length; i++) {
    if (hourly.time[i].startsWith(currentIsoHour)) {
      startIndex = i;
      break;
    }
  }

  // Next 24 hours
  const hoursToShow = 24;
  for (let i = startIndex; i < Math.min(startIndex + hoursToShow, hourly.time.length); i++) {
    const timeStr = hourly.time[i];
    const date = parseDateSafe(timeStr);
    const hourFormatted = i === startIndex ? "Now" : date.toLocaleTimeString([], { hour: 'numeric' });
    const code = hourly.weather_code[i];
    const isDay = hourly.is_day ? hourly.is_day[i] : 1;
    const info = WEATHER_CONFIG[code] || { icon: "sun" };
    const temp = toDisplayTemp(hourly.temperature_2m[i]);
    const rainProb = hourly.precipitation_probability ? hourly.precipitation_probability[i] : 0;

    const card = document.createElement("div");
    card.className = `hourly-card ${i === startIndex ? 'active-hour' : ''}`;
    card.innerHTML = `
      <span class="hourly-time">${hourFormatted}</span>
      <div class="hourly-icon">${getWeatherSVG(info.icon, isDay)}</div>
      <span class="hourly-temp">${temp}${getTempUnit()}</span>
      ${rainProb > 10 ? `<span class="hourly-rain">💧 ${rainProb}%</span>` : `<span class="hourly-rain" style="opacity:0;" aria-hidden="true">--</span>`}
    `;
    container.appendChild(card);
  }
}

// Render 7-Day Forecast with temperature range bar
function renderDailyForecast(daily) {
  const container = document.getElementById("daily-container");
  if (!container) return;
  container.innerHTML = "";

  const allMins = daily.temperature_2m_min;
  const allMaxs = daily.temperature_2m_max;
  const globalMin = Math.min(...allMins);
  const globalMax = Math.max(...allMaxs);
  const range = (globalMax - globalMin) || 1;

  for (let i = 0; i < daily.time.length; i++) {
    const date = parseDateSafe(daily.time[i]);
    const dayName = i === 0 ? "Today" : date.toLocaleDateString([], { weekday: 'short' });
    const code = daily.weather_code[i];
    const info = WEATHER_CONFIG[code] || { text: "Clear", icon: "sun" };
    const minTemp = daily.temperature_2m_min[i];
    const maxTemp = daily.temperature_2m_max[i];

    const leftPercent = ((minTemp - globalMin) / range) * 100;
    const widthPercent = Math.max(12, ((maxTemp - minTemp) / range) * 100);

    const row = document.createElement("div");
    row.className = "daily-row";
    row.innerHTML = `
      <div class="daily-name">${dayName}</div>
      <div class="daily-icon">${getWeatherSVG(info.icon, 1)}</div>
      <div class="daily-condition" title="${info.text}">${info.text}</div>
      <div class="daily-temp-bar-container">
        <span class="temp-min-text">${toDisplayTemp(minTemp)}°</span>
        <div class="temp-bar-bg" aria-hidden="true">
          <div class="temp-bar-fill" style="left:${leftPercent}%; width:${widthPercent}%;"></div>
        </div>
        <span class="temp-max-text">${toDisplayTemp(maxTemp)}°</span>
      </div>
    `;
    container.appendChild(row);
  }
}

// Leaflet Map Update with responsive resize check
function updateMap(lat, lon, title, tempText) {
  const mapElement = document.getElementById("map");
  if (!mapElement || typeof L === 'undefined') return;

  if (!state.map) {
    state.map = L.map('map', { zoomControl: false, attributionControl: false }).setView([lat, lon], 10);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 18,
    }).addTo(state.map);
  } else {
    state.map.setView([lat, lon], 10);
    state.map.invalidateSize();
  }

  if (state.mapMarker) {
    state.map.removeLayer(state.mapMarker);
  }

  const cleanTitle = title.length > 20 ? title.substring(0, 18) + '...' : title;
  const customIcon = L.divIcon({
    className: 'custom-map-pin',
    html: `<div style="background:#4f7cff; color:#fff; padding:4px 10px; border-radius:20px; font-size:12px; font-weight:bold; box-shadow:0 4px 12px rgba(0,0,0,0.4); white-space:nowrap; border:2px solid #fff; pointer-events:none;">📍 ${cleanTitle}: ${tempText}</div>`,
    iconSize: [120, 30],
    iconAnchor: [60, 35]
  });

  state.mapMarker = L.marker([lat, lon], { icon: customIcon }).addTo(state.map);
}

// Load Weather for a selected place
async function loadPlaceWeather(placeObj) {
  try {
    setLoading(true);
    if (autocompleteBox) autocompleteBox.classList.remove("show");
    const data = await fetchWeatherData(placeObj.lat, placeObj.lon, placeObj.timezone);
    renderWeatherDashboard(placeObj, data);
    if (searchInput) searchInput.value = placeObj.title || placeObj.name.split(",")[0];

    // Save to localStorage
    try {
      localStorage.setItem("last_weather_place", JSON.stringify(placeObj));
    } catch(e){}
  } catch (err) {
    console.error(err);
    showToast("Could not load weather for this location. Please try again.");
  } finally {
    setLoading(false);
  }
}

// Execute Search from Input
async function handleSearch() {
  if (!searchInput) return;
  const q = searchInput.value.trim();
  if (!q) {
    showToast("Please enter a city or place name.");
    return;
  }
  setLoading(true);
  try {
    const results = await searchLocation(q);
    if (!results || results.length === 0) {
      showToast(`No location found for "${q}". Please try a different name.`);
      return;
    }
    await loadPlaceWeather(results[0]);
  } catch (err) {
    console.error(err);
    showToast("Search failed. Check your network connection.");
  } finally {
    setLoading(false);
  }
}

// Autocomplete Input Handler with Debounce
if (searchInput) {
  searchInput.addEventListener("input", (e) => {
    const val = e.target.value.trim();
    clearTimeout(state.debounceTimer);

    if (val.length < 2) {
      if (autocompleteBox) autocompleteBox.classList.remove("show");
      return;
    }

    state.debounceTimer = setTimeout(async () => {
      const places = await searchLocation(val);
      if (!places || places.length === 0 || !autocompleteBox) {
        if (autocompleteBox) autocompleteBox.classList.remove("show");
        return;
      }

      autocompleteBox.innerHTML = "";
      places.slice(0, 5).forEach(p => {
        const item = document.createElement("div");
        item.className = "autocomplete-item";
        item.setAttribute("role", "option");
        item.innerHTML = `
          <div style="min-width:0; flex:1;">
            <div class="autocomplete-place">${p.title || p.name.split(",")[0]}</div>
            <div class="autocomplete-subtext">${p.subtitle || p.name}</div>
          </div>
          <span style="font-size:0.75rem; color:var(--primary-light); flex-shrink:0;">Select ➔</span>
        `;
        item.addEventListener("click", () => {
          loadPlaceWeather(p);
        });
        autocompleteBox.appendChild(item);
      });
      autocompleteBox.classList.add("show");
    }, 280);
  });

  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      if (autocompleteBox) autocompleteBox.classList.remove("show");
      handleSearch();
    }
  });
}

// Close autocomplete on click outside
document.addEventListener("click", (e) => {
  if (!e.target.closest(".search-wrapper") && autocompleteBox) {
    autocompleteBox.classList.remove("show");
  }
});

if (searchBtn) {
  searchBtn.addEventListener("click", () => {
    if (autocompleteBox) autocompleteBox.classList.remove("show");
    handleSearch();
  });
}

// GPS My Location
if (gpsBtn) {
  gpsBtn.addEventListener("click", () => {
    if (!navigator.geolocation) {
      showToast("Geolocation is not supported by your browser.");
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        const place = {
          name: "My Current Location",
          title: "Current Location",
          subtitle: `${lat.toFixed(4)}°, ${lon.toFixed(4)}°`,
          lat: lat,
          lon: lon,
          timezone: "auto"
        };
        await loadPlaceWeather(place);
      },
      (err) => {
        setLoading(false);
        showToast("Unable to retrieve location. Please grant browser permissions.");
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  });
}

// Unit Toggle Buttons
if (unitCBtn && unitFBtn) {
  unitCBtn.addEventListener("click", () => {
    if (state.currentUnit === 'c') return;
    state.currentUnit = 'c';
    unitCBtn.classList.add("active");
    unitFBtn.classList.remove("active");
    if (state.currentLocation && state.currentWeatherData) {
      renderWeatherDashboard(state.currentLocation, state.currentWeatherData);
    }
  });

  unitFBtn.addEventListener("click", () => {
    if (state.currentUnit === 'f') return;
    state.currentUnit = 'f';
    unitFBtn.classList.add("active");
    unitCBtn.classList.remove("active");
    if (state.currentLocation && state.currentWeatherData) {
      renderWeatherDashboard(state.currentLocation, state.currentWeatherData);
    }
  });
}

// Quick City Chips
quickChips.forEach(chip => {
  chip.addEventListener("click", () => {
    const city = chip.getAttribute("data-city");
    if (searchInput) searchInput.value = city;
    handleSearch();
  });
});

// Window Resize & Orientation Change Map Fix
window.addEventListener("resize", () => {
  clearTimeout(state.resizeDebounceTimer);
  state.resizeDebounceTimer = setTimeout(() => {
    if (state.map) {
      state.map.invalidateSize();
    }
  }, 200);
});

// Initialize on Load
window.addEventListener("DOMContentLoaded", () => {
  const saved = localStorage.getItem("last_weather_place");
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      loadPlaceWeather(parsed);
      return;
    } catch(e){}
  }

  // Default initial city (e.g. London)
  loadPlaceWeather({
    name: "London, Greater London, England, United Kingdom",
    title: "London",
    subtitle: "Greater London, United Kingdom",
    lat: 51.5074,
    lon: -0.1278,
    timezone: "Europe/London"
  });
});
