import React, {useState, useEffect} from 'react'
import axios from 'axios'

const App = ({ openweather_api_key }) => {
  const [countries, setCountries] = useState([]);
  const [filter, setFilter] = useState('');

  const url = "https://restcountries.com/v3.1/all";

  useEffect(() => {
    axios
      .get(url)
      .then(response => setCountries(response.data));
  }, []);

  const updateFilter = (event) => {
    setFilter(event.target.value);
  };

  const filtered = () => {
    return countries
              .filter(
                country => 
                  country.name.common.toLowerCase()
                      .includes(filter.toLowerCase())
              );
  };

  return (
    <div>
      <div>
        find countries <input value={filter} onChange={updateFilter} />
      </div>
      <Content items={filtered()} handleClick={setFilter} weather_api_key={openweather_api_key}/>
    </div>
  )
}

const Content = ({ items, handleClick, weather_api_key }) => {
  
 
  if (items.length > 10) {
    return (
      <div> Too many matches, specify another filter </div>
    )
  }

  if (items.length > 1) {
    return (
      <div>
        {items.map(country => 
            <p key={country.name.common}>
              {country.name.common + " "} 
              <button onClick={() => handleClick(country.name.common)}>show</button>
            </p>
        )}
      </div>
    )
  }
  
  if (items.length === 0) {
    return (
      <div> No country matched the filter </div>
    )
  }

  const country = items[0];

  return (
    <DetailedView country={country} weather_api_key={weather_api_key} />
  )
}

const DetailedView = ({ country, weather_api_key }) => {
  const [weatherData, setWeatherData] = useState({});
  const capital = country.capital[0];
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${weather_api_key}`;
  useEffect(() => {
    axios
      .get(url)
      .then(response => console.log(response.data) || setWeatherData(response.data))
  }, [country.name.common]);


  const temp_celcius = weatherData.main ? Math.floor(weatherData.main.temp - 273.15) : 0;
  const weather = weatherData.weather ? weatherData.weather[0] : null;
  return (
    <div> 
      <h1>{country.name.common}</h1>
      capital: {capital} <br/>
      region: {country.region}
      <h2>Languages</h2>
      <ul>
        {
          Object.keys(country.languages).map(key => 
            <li key={key}> {country.languages[key]} </li>
          )
        }
      </ul>
      <img src={country.flags.png} />
      <h2>Weather in {capital}</h2>
      <p><b>Temperature:</b> {temp_celcius} °C</p>
      <p><b>{weather?.main}</b>: {weather?.description}</p>
    </div>
  )
}

export default App
