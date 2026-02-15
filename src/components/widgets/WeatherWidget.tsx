import React, { useState, useEffect, useCallback } from 'react';
import WidgetCard from './WidgetCard';
import { getWidgetConfig, setWidgetConfig } from '../../utils/storage';
import { WeatherWidgetConfig } from '../../types';

const DEFAULTS: WeatherWidgetConfig = {
  latitude: null,
  longitude: null,
  city: '',
  units: 'metric',
  autoDetect: true,
};

// WMO Weather Code → description + icon
const WMO_CODES: Record<number, { desc: string; icon: string; night?: string }> = {
  0: { desc: 'Clear sky', icon: '☀️', night: '🌙' },
  1: { desc: 'Mainly clear', icon: '🌤️', night: '🌙' },
  2: { desc: 'Partly cloudy', icon: '⛅', night: '☁️' },
  3: { desc: 'Overcast', icon: '☁️' },
  45: { desc: 'Foggy', icon: '🌫️' },
  48: { desc: 'Rime fog', icon: '🌫️' },
  51: { desc: 'Light drizzle', icon: '🌦️' },
  53: { desc: 'Drizzle', icon: '🌦️' },
  55: { desc: 'Dense drizzle', icon: '🌧️' },
  56: { desc: 'Light freezing drizzle', icon: '🌧️' },
  57: { desc: 'Freezing drizzle', icon: '🌧️' },
  61: { desc: 'Light rain', icon: '🌦️' },
  63: { desc: 'Moderate rain', icon: '🌧️' },
  65: { desc: 'Heavy rain', icon: '🌧️' },
  66: { desc: 'Light freezing rain', icon: '🌧️' },
  67: { desc: 'Freezing rain', icon: '🌧️' },
  71: { desc: 'Light snow', icon: '🌨️' },
  73: { desc: 'Moderate snow', icon: '❄️' },
  75: { desc: 'Heavy snow', icon: '❄️' },
  77: { desc: 'Snow grains', icon: '❄️' },
  80: { desc: 'Light showers', icon: '🌦️' },
  81: { desc: 'Moderate showers', icon: '🌧️' },
  82: { desc: 'Violent showers', icon: '🌧️' },
  85: { desc: 'Light snow showers', icon: '🌨️' },
  86: { desc: 'Heavy snow showers', icon: '❄️' },
  95: { desc: 'Thunderstorm', icon: '⛈️' },
  96: { desc: 'Thunderstorm, light hail', icon: '⛈️' },
  99: { desc: 'Thunderstorm, heavy hail', icon: '⛈️' },
};

function getWeatherInfo(code: number, isDay: boolean) {
  const info = WMO_CODES[code] || { desc: 'Unknown', icon: '🌡️' };
  return {
    desc: info.desc,
    icon: (!isDay && info.night) ? info.night : info.icon,
  };
}

interface GeoResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string;
  country_code: string;
}

interface WeatherData {
  temperature: number;
  apparentTemp: number;
  humidity: number;
  weatherCode: number;
  windSpeed: number;
  isDay: boolean;
  tempMax: number;
  tempMin: number;
  sunrise: string;
  sunset: string;
}

const WeatherWidget: React.FC = () => {
  const [config, setConfig] = useState<WeatherWidgetConfig>(DEFAULTS);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<GeoResult[]>([]);
  const [searching, setSearching] = useState(false);

  // Load config on mount
  useEffect(() => {
    getWidgetConfig('weather', DEFAULTS, (loaded) => {
      setConfig(loaded);
      if (loaded.latitude && loaded.longitude) {
        fetchWeather(loaded.latitude, loaded.longitude, loaded.units);
      } else if (loaded.autoDetect) {
        detectLocation();
      }
    });
  }, []);

  // Fetch weather from Open-Meteo
  const fetchWeather = useCallback(async (lat: number, lon: number, units: 'metric' | 'imperial') => {
    setLoading(true);
    setError(null);
    try {
      const tempUnit = units === 'imperial' ? '&temperature_unit=fahrenheit' : '';
      const windUnit = units === 'imperial' ? '&wind_speed_unit=mph' : '';
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,is_day&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset&timezone=auto&forecast_days=1${tempUnit}${windUnit}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('API error');
      const data = await res.json();

      setWeather({
        temperature: Math.round(data.current.temperature_2m),
        apparentTemp: Math.round(data.current.apparent_temperature),
        humidity: data.current.relative_humidity_2m,
        weatherCode: data.current.weather_code,
        windSpeed: Math.round(data.current.wind_speed_10m),
        isDay: data.current.is_day === 1,
        tempMax: Math.round(data.daily.temperature_2m_max[0]),
        tempMin: Math.round(data.daily.temperature_2m_min[0]),
        sunrise: data.daily.sunrise[0],
        sunset: data.daily.sunset[0],
      });
    } catch (err) {
      setError('Failed to fetch weather');
      console.error('Weather fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-detect location via browser geolocation
  const detectLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported');
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        // Reverse-lookup city name via geocoding
        let city = '';
        try {
          const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?latitude=${latitude}&longitude=${longitude}&count=1`);
          const geoData = await geoRes.json();
          if (geoData.results?.[0]) {
            city = geoData.results[0].name;
          }
        } catch {}
        // Try to get city from search with coordinates
        if (!city) {
          try {
            const resp = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${latitude.toFixed(2)},${longitude.toFixed(2)}&count=1`);
            const d = await resp.json();
            if (d.results?.[0]) city = d.results[0].name;
          } catch {}
        }
        const updated: WeatherWidgetConfig = {
          ...config,
          latitude,
          longitude,
          city: city || `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`,
          autoDetect: true,
        };
        setConfig(updated);
        setWidgetConfig('weather', updated);
        fetchWeather(latitude, longitude, updated.units);
      },
      (err) => {
        setLoading(false);
        if (err.code === err.PERMISSION_DENIED) {
          setError('Location access denied. Search for a city instead.');
        } else {
          setError('Could not detect location');
        }
      },
      { enableHighAccuracy: false, timeout: 10000 }
    );
  }, [config, fetchWeather]);

  // City search via Open-Meteo Geocoding API
  const handleSearch = useCallback(async (query: string) => {
    if (query.length < 2) { setSearchResults([]); return; }
    setSearching(true);
    try {
      const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en`);
      const data = await res.json();
      setSearchResults(data.results || []);
    } catch {
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  }, []);

  // Debounced search
  useEffect(() => {
    if (!showSearch) return;
    const timer = setTimeout(() => handleSearch(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery, showSearch, handleSearch]);

  // Select a city
  const handleSelectCity = (result: GeoResult) => {
    const updated: WeatherWidgetConfig = {
      ...config,
      latitude: result.latitude,
      longitude: result.longitude,
      city: `${result.name}${result.admin1 ? `, ${result.admin1}` : ''}, ${result.country_code}`,
      autoDetect: false,
    };
    setConfig(updated);
    setWidgetConfig('weather', updated);
    fetchWeather(result.latitude, result.longitude, updated.units);
    setShowSearch(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  // Toggle units
  const toggleUnits = () => {
    const newUnits = config.units === 'metric' ? 'imperial' : 'metric';
    const updated = { ...config, units: newUnits as 'metric' | 'imperial' };
    setConfig(updated);
    setWidgetConfig('weather', updated);
    if (config.latitude && config.longitude) {
      fetchWeather(config.latitude, config.longitude, newUnits as 'metric' | 'imperial');
    }
  };

  // Refresh
  const handleRefresh = () => {
    if (config.latitude && config.longitude) {
      fetchWeather(config.latitude, config.longitude, config.units);
    } else {
      detectLocation();
    }
  };

  const unitLabel = config.units === 'imperial' ? '°F' : '°C';
  const windLabel = config.units === 'imperial' ? 'mph' : 'km/h';

  return (
    <WidgetCard
      title="Weather"
      icon={
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z" />
        </svg>
      }
      headerRight={
        <div className="flex items-center gap-1">
          {/* Search city button */}
          <button
            onClick={() => setShowSearch(!showSearch)}
            className={`p-1.5 rounded-lg transition-all cursor-pointer ${showSearch ? 't-secondary' : 't-faint hover:t-tertiary'}`}
            style={showSearch ? { backgroundColor: 'var(--glass-bg)' } : undefined}
            title="Search city"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </button>
          {/* Refresh */}
          <button
            onClick={handleRefresh}
            className="p-1.5 rounded-lg t-faint hover:t-tertiary transition-all cursor-pointer"
            title="Refresh"
          >
            <svg className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
            </svg>
          </button>
        </div>
      }
    >
      {/* City search panel */}
      {showSearch && (
        <div className="mb-3 space-y-2">
          <div className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search city..."
              className="glass-input text-xs flex-1"
              autoFocus
            />
            <button
              onClick={detectLocation}
              className="glass-button-ghost text-xs px-2.5 flex items-center gap-1"
              title="Use my location"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
              <span className="hidden sm:inline">Auto</span>
            </button>
          </div>
          {searching && <p className="text-[10px] t-faint text-center">Searching...</p>}
          {searchResults.length > 0 && (
            <div className="space-y-0.5 max-h-36 overflow-y-auto">
              {searchResults.map(r => (
                <button
                  key={r.id}
                  onClick={() => handleSelectCity(r)}
                  className="w-full text-left px-3 py-2 rounded-lg bg-[var(--glass-bg-subtle)] hover:bg-[var(--glass-bg-subtle-hover)] transition-colors cursor-pointer"
                >
                  <p className="text-xs t-secondary">{r.name}{r.admin1 ? `, ${r.admin1}` : ''}</p>
                  <p className="text-[10px] t-faint">{r.country} &middot; {r.latitude.toFixed(2)}, {r.longitude.toFixed(2)}</p>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Loading state */}
      {loading && !weather && (
        <div className="flex items-center justify-center py-6">
          <div className="w-5 h-5 border-2 rounded-full animate-spin" style={{ borderColor: 'var(--glass-border)', borderTopColor: 'var(--text-tertiary)' }} />
          <span className="text-xs t-faint ml-2">Detecting location...</span>
        </div>
      )}

      {/* Error state */}
      {error && !weather && (
        <div className="text-center py-3 space-y-2">
          <p className="text-xs t-muted">{error}</p>
          <button
            onClick={() => { setShowSearch(true); setError(null); }}
            className="glass-button text-xs px-3 py-1.5"
          >
            Search for a city
          </button>
        </div>
      )}

      {/* Weather display */}
      {weather && (
        <div>
          {/* Main row: Icon + Temp + Details */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <span className="text-4xl leading-none">{getWeatherInfo(weather.weatherCode, weather.isDay).icon}</span>
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-light t-primary tabular-nums">{weather.temperature}</span>
                  <button
                    onClick={toggleUnits}
                    className="text-sm t-muted hover:t-tertiary transition-colors cursor-pointer"
                    title={`Switch to ${config.units === 'metric' ? 'Fahrenheit' : 'Celsius'}`}
                  >
                    {unitLabel}
                  </button>
                </div>
                <p className="text-xs t-tertiary capitalize">{getWeatherInfo(weather.weatherCode, weather.isDay).desc}</p>
              </div>
            </div>

            {/* High / Low */}
            <div className="text-right">
              <div className="flex items-center gap-1.5 text-[11px]">
                <svg className="w-3 h-3 t-faint" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
                </svg>
                <span className="t-tertiary tabular-nums">{weather.tempMax}{unitLabel}</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] mt-0.5">
                <svg className="w-3 h-3 t-faint" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
                </svg>
                <span className="t-muted tabular-nums">{weather.tempMin}{unitLabel}</span>
              </div>
            </div>
          </div>

          {/* Details row */}
          <div className="flex items-center gap-4 mt-3 pt-3 border-t" style={{ borderColor: 'var(--divider)' }}>
            {/* Feels like */}
            <div className="flex items-center gap-1.5">
              <svg className="w-3 h-3 t-faint" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.047 8.287 8.287 0 009 9.601a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
              </svg>
              <span className="text-[10px] t-muted">Feels {weather.apparentTemp}{unitLabel}</span>
            </div>
            {/* Humidity */}
            <div className="flex items-center gap-1.5">
              <svg className="w-3 h-3 t-faint" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 2.25c0 0-6.75 8.25-6.75 12a6.75 6.75 0 0013.5 0c0-3.75-6.75-12-6.75-12z" />
              </svg>
              <span className="text-[10px] t-muted">{weather.humidity}%</span>
            </div>
            {/* Wind */}
            <div className="flex items-center gap-1.5">
              <svg className="w-3 h-3 t-faint" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
              </svg>
              <span className="text-[10px] t-muted">{weather.windSpeed} {windLabel}</span>
            </div>
          </div>

          {/* City + last update */}
          <div className="flex items-center justify-between mt-2.5">
            <p className="text-[10px] t-faint truncate flex-1">
              {config.city}{config.autoDetect ? ' (auto)' : ''}
            </p>
            <p className="text-[10px] shrink-0 ml-2" style={{ color: 'var(--text-invisible)' }}>Open-Meteo</p>
          </div>
        </div>
      )}

      {/* Initial state — no weather, no loading, no error */}
      {!weather && !loading && !error && (
        <div className="text-center py-4 space-y-2">
          <p className="text-xs t-faint">Weather data not available</p>
          <div className="flex items-center justify-center gap-2">
            <button onClick={detectLocation} className="glass-button text-xs px-3 py-1.5">
              Use my location
            </button>
            <button onClick={() => setShowSearch(true)} className="glass-button-ghost text-xs px-3 py-1.5">
              Search city
            </button>
          </div>
        </div>
      )}
    </WidgetCard>
  );
};

export default WeatherWidget;
