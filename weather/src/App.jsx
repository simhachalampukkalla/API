import { useCallback, useEffect, useState, useMemo } from "react";
import WeatherCard from "./components/weatherCard";
import weatherData from "./components/weatherData";
import useDebounce from "./components/useDebounce"; // rename recommended
import PopUp from "./components/popUp";
import "./App.css";


function App() {
  

  const [user, setUser] = useState(null);

  function userFetch(url) {
    // Implementation for fetching user dat
    useEffect(() => {

      fetch(url)
        .then((resp) => resp.json())
        .then((data) => {
          console.log("Fetched user data:", data);
          setUser(data);
        });

    }, [url])
  }

  const data = userFetch("https://api.open-meteo.com/v1/forecast?latitude=17.3850&longitude=78.4867&current_weather=true");
  console.log("app rendered", user)
  const [input, setInput] = useState("");
  const [form, setForm] = useState({name : '', email : ''});
  const [isPopUpOpen, setIsPopUpOpen] = useState(false);
  const [city, setCity] = useState("");

  const debouncedInput = useDebounce(input, 500);

  useEffect(() => {
    setCity(debouncedInput);
  }, [debouncedInput]);

  const handleChange = useCallback((e) => {
    setInput(e.target.value);
  }, []);

  const handleFormChange = (e) =>{
   setForm ({...form,[e.target.name]: e.target.value})
  }

  // const weather = useMemo(() => {
  //   let cty = city.charAt(0).toUpperCase() + city.slice(1);
  //   return weatherData[cty] || null;
  // }, [city]);


  const filterCities = useMemo(() => {
    return Object.keys(weatherData).filter((key) =>
      key.includes(city)
    );
  }, [city]);


  useEffect(() => {
    if (city && filterCities.length === 0) {
      setIsPopUpOpen(true);
    } else {
      setIsPopUpOpen(false);
      //handleChange({ target: { value: "" } });
    }
  }, [filterCities, city]);

  return (
    <div>
      <h3>Weather Report</h3>
      <div className="form">
        <input name ="name" className="input" placeholder="Enter name" onChange={handleFormChange}/>
        <input name ="email" className="input" placeholder="Enter email" onChange={handleFormChange}/>
        <button onClick ={()=>console.log(form)} className="formbtn">Submit</button>
      </div>
      <input
        type="text"
        placeholder="Enter city name"
        value={input}
        onChange={handleChange}
      />
      {
        filterCities.length > 0 && (
          <div style={{ display: "flex", gap: "10px", height: "700px", overflowY: "auto", flexWrap: "wrap" }}>
            {filterCities.map((city) => (

              <WeatherCard
                key={city}
                city={city}
                weather={weatherData[city] || null}
              />
            ))}
          </div>
        )
      }

      {/* {filterCities.length === 0 && <p>No cities found</p>} */}
      <PopUp
        isOpen={isPopUpOpen}
        onClose={() => {
          setIsPopUpOpen(false);
          setInput("");     // ✅ reset input
          setCity("");      // ✅ reset city
        }}
      />

      {/* {weather ? (
        <WeatherCard weather={weather} city={city} />
      ) : (
        city && <p>No data found</p>
      )} */}
    </div>
  );
}

export default App;