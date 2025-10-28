import React from 'react';
import Icon from '../../../components/AppIcon';

const WeatherWidget = () => {
  const weatherData = [
    {
      id: 1,
      destination: "Santorini, Greece",
      date: "Dec 20, 2025",
      temperature: 18,
      condition: "Sunny",
      icon: "Sun",
      humidity: 65,
      windSpeed: 12,
      packingSuggestion: "Light layers, sunscreen"
    },
    {
      id: 2,
      destination: "Tokyo, Japan",
      date: "Feb 14, 2026",
      temperature: 8,
      condition: "Partly Cloudy",
      icon: "Cloud",
      humidity: 70,
      windSpeed: 8,
      packingSuggestion: "Warm clothes, umbrella"
    }
  ];

  const getWeatherIcon = (condition) => {
    switch (condition?.toLowerCase()) {
      case 'sunny':
        return 'Sun';
      case 'cloudy': case'partly cloudy':
        return 'Cloud';
      case 'rainy':
        return 'CloudRain';
      case 'snowy':
        return 'Snowflake';
      default:
        return 'Sun';
    }
  };

  const getWeatherColor = (condition) => {
    switch (condition?.toLowerCase()) {
      case 'sunny':
        return 'text-warning bg-warning/10';
      case 'cloudy': case'partly cloudy':
        return 'text-muted-foreground bg-muted';
      case 'rainy':
        return 'text-primary bg-primary/10';
      case 'snowy':
        return 'text-blue-500 bg-blue-50';
      default:
        return 'text-warning bg-warning/10';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-heading text-xl font-semibold text-foreground">Weather Forecast</h2>
        <Icon name="CloudSun" size={20} className="text-muted-foreground" />
      </div>
      <div className="space-y-4">
        {weatherData?.map((weather) => (
          <div key={weather?.id} className="border border-border rounded-lg p-4 hover:shadow-tourism transition-tourism">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-body font-semibold text-foreground">{weather?.destination}</h3>
                <p className="font-caption text-sm text-muted-foreground">{weather?.date}</p>
              </div>
              <div className={`rounded-lg p-2 ${getWeatherColor(weather?.condition)}`}>
                <Icon name={getWeatherIcon(weather?.condition)} size={24} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-3">
              <div className="text-center">
                <span className="font-mono text-2xl font-bold text-foreground">
                  {weather?.temperature}°C
                </span>
                <p className="font-caption text-xs text-muted-foreground">{weather?.condition}</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-body text-muted-foreground">Humidity</span>
                  <span className="font-mono text-foreground">{weather?.humidity}%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-body text-muted-foreground">Wind</span>
                  <span className="font-mono text-foreground">{weather?.windSpeed} km/h</span>
                </div>
              </div>
            </div>

            <div className="bg-muted rounded-lg p-3">
              <div className="flex items-start space-x-2">
                <Icon name="Package" size={16} className="text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-body font-medium text-foreground text-sm mb-1">Packing Suggestion</p>
                  <p className="font-caption text-xs text-muted-foreground">{weather?.packingSuggestion}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-border text-center">
        <p className="font-caption text-xs text-muted-foreground">
          Weather data helps you pack smart for your upcoming trips
        </p>
      </div>
    </div>
  );
};

export default WeatherWidget;