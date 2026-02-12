import React, { useState, useEffect } from 'react';
import WidgetCard from './WidgetCard';
import { getWidgetConfig, setWidgetConfig } from '../../utils/storage';
import { WeatherWidgetConfig } from '../../types';

const DEFAULTS: WeatherWidgetConfig = { city: '', units: 'metric', apiKey: '' };

interface WeatherData {
  temp: number;
  description: string;
  icon: string;
  city: string;
}

const WeatherWidget: React.FC = () => {
  const [config, setConfig] = useState<WeatherWidgetConfig>(DEFAULTS);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [showConfig, setShowConfig] = useState(false);
  const [cityInput, setCityInput] = useState('');

  useEffect(() => {
    getWidgetConfig('weather', DEFAULTS, (loaded) => {
      setConfig(loaded);
      setCityInput(loaded.city);
      if (loaded.city && loaded.apiKey) {
        fetchWeather(loaded);
      }
    });
  }, []);

  const fetchWeather = async (cfg: WeatherWidgetConfig) => {
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cfg.city}&units=${cfg.units}&appid=${cfg.apiKey}`
      );
      const data = await res.json();
      if (data.main) {
        setWeather({
          temp: Math.round(data.main.temp),
          description: data.weather[0]?.description || '',
          icon: data.weather[0]?.icon || '01d',
          city: data.name,
        });
      }
    } catch (err) {
      console.error('Weather fetch error:', err);
    }
  };

  const handleSaveConfig = () => {
    const updated = { ...config, city: cityInput };
    setConfig(updated);
    setWidgetConfig('weather', updated);
    if (cityInput && config.apiKey) {
      fetchWeather(updated);
    }
    setShowConfig(false);
  };

  return (
    <WidgetCard
      title="Weather"
      icon={
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z" />
        </svg>
      }
      onSettings={() => setShowConfig(!showConfig)}
    >
      {showConfig ? (
        <div className="space-y-2">
          <input
            type="text"
            value={cityInput}
            onChange={e => setCityInput(e.target.value)}
            placeholder="City name"
            className="glass-input text-xs"
          />
          <input
            type="text"
            value={config.apiKey}
            onChange={e => setConfig({ ...config, apiKey: e.target.value })}
            placeholder="OpenWeather API key"
            className="glass-input text-xs"
          />
          <button onClick={handleSaveConfig} className="glass-button text-xs w-full">Save</button>
        </div>
      ) : weather ? (
        <div className="flex items-center justify-between">
          <div>
            <p className="text-3xl font-light text-white">{weather.temp}°</p>
            <p className="text-xs text-white/50 capitalize">{weather.description}</p>
            <p className="text-xs text-white/30">{weather.city}</p>
          </div>
          <img
            src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
            alt={weather.description}
            className="w-16 h-16 opacity-80"
          />
        </div>
      ) : (
        <div className="text-center py-2">
          <p className="text-xs text-white/30">Click settings to configure weather</p>
        </div>
      )}
    </WidgetCard>
  );
};

export default WeatherWidget;
