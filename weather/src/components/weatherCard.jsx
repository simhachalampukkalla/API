import React from "react";

const WeatherCard = ({ weather, city }) => {

  if (!weather) return null;

  return (
    <div className="card">
      <img className="tImage" src={weather.image} alt={weather.place} width="100%" />
      <h2 className="h2">{city.charAt(0).toUpperCase() + city.slice(1)}</h2>
      <h1 className="h1">{weather.temp}°C</h1>
      <p>{weather.condition}</p>
      <p>Humidity: {weather.humidity}%</p>
    </div>
    
    
  );
};

export default React.memo(WeatherCard);