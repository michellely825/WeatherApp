import {useState} from "react";
import {getCoords, getWeeklyWeather, getTodaysWeather, TodaysWeather} from "./Api/getWeather";
import {Coordinates} from "./Api/getWeather";
import {WeeklyWeather} from "./Api/getWeather";
import style from "./App.module.css";
import background from "./assets/pic9.jpg";
import { BsSearch } from '../node_modules/react-icons/bs';


function App() {
  const [city, setCity] = useState("");
  const [todaysWeather, setTodaysWeather] = useState<TodaysWeather>();
  const [weeklyWeather, setWeeklyWeather] = useState<WeeklyWeather[]>([]);

  
  const fetchData = async (city: string) => {
    try {
      const coords: Coordinates = await getCoords(city);
      const todaysWeatherData = await getTodaysWeather(coords.lat, coords.lon);
      const weeklyWeatherData = await getWeeklyWeather(coords.lat, coords.lon);
      setTodaysWeather(todaysWeatherData)
      setWeeklyWeather(weeklyWeatherData)
      setCity('')
    } catch (error) {
      console.log('Error fetching weather data:', error);
    }
  };

  const handleSubmit = (event:any) => {
    event.preventDefault();
    fetchData(city)
  }

  return (
    <div className={style.app} style={{ backgroundImage: `url(${background})`, backgroundRepeat: "no-repeat", backgroundPosition: 'center', backgroundSize: 'cover', position: 'relative'}}>
      <div className={style.overlay}>
      <h1 className={style.WeatherApp}>MICHY'S WEATHER APP</h1>
      
      {/* Search */}
      <div className={style.inputdiv}>
        <form onSubmit={handleSubmit} className={style.inputform}>
          <div>
          <input className={style.Input}
            type="text"
            placeholder="Enter City Name"
            value={city}
            onChange={(event) => setCity(event.target.value)}/>
          </div>
          <button type="submit" className={style.btn} onClick={()=> fetchData(city)}><BsSearch /></button>
        </form>
      </div>

      <div className={style.container}>

        {/* Top*/}
        {todaysWeather?.city != undefined &&
        <div className={style.top}>
          <div className={style.general}>
              <div className={style.location}>
                {todaysWeather ? <h2>{todaysWeather?.city}, {todaysWeather?.country}</h2>: null}
              </div>
              <div className={style.date}>
                <h3>{todaysWeather?.date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</h3>
              </div>
              <div className={style.weatherCard}> 
                    <div> 
                      <img className={style.icon} src={`https://openweathermap.org/img/wn/${todaysWeather.icon}@2x.png`}/>
                    </div>
                    <div className={style.together}>
                          <div className={style.temp}>
                            {todaysWeather ? <h1>{Math.trunc(todaysWeather?.temp)}°F</h1>: null}
                          </div>
                          <div>
                          <h3 className={style.description}>{todaysWeather?.description}</h3>
                          </div>
                    </div>
              </div>
          </div>
          <div className={style.details}>
            <div className={style.tempRange}>
                <div className={style.max}>
                  {todaysWeather ? <h2>{Math.trunc(todaysWeather?.max)}°F</h2>: null}
                  {todaysWeather ? <h3>Max</h3>: null}
                </div>
                <div className={style.min}>
                  {todaysWeather ? <h2>{Math.trunc(todaysWeather?.min)}°F</h2>:null}
                  {todaysWeather ? <h3>Min</h3>:null}
                </div>
            </div>
            <div className={style.sun}>
              <div className={style.sunrise}>
                <h2>{todaysWeather?.sunrise.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric'})}</h2>
                <h3>Sunrise</h3>
              </div>
              <div className={style.sunset}>
                <h2>{todaysWeather?.sunset.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric'})}</h2>
                <h3>Sunset</h3>
              </div>
            </div>
          </div>
        </div>
        }
        {/* Bottom*/}
        {todaysWeather?.city != undefined &&
        <div className={style.bottom}>
          <div className={style.weeklyForecast}>
            <h2>Weekly Forecast</h2>
          </div>
          <p className={style.forecast}>
          {weeklyWeather.map((weatherDay:WeeklyWeather) => {
          return (
          <div className={style.weeklydata}>
            <h5 className={style.forecastDate}>{weatherDay.date.toLocaleDateString('en-US', {weekday: 'short', month: '2-digit', day: '2-digit'})}</h5>
            <h5 className={style.forecastTemp}>{Math.trunc(weatherDay.max) + "/" + Math.trunc(weatherDay.min) + "°F"}</h5>
            <img className={style.weeklyIcon} src={`https://openweathermap.org/img/wn/${weatherDay.icon}@2x.png`}/>
          </div>)
        })}
          </p>
        </div>
        }
      </div>
      </div>
    </div>
    );
  };

export default App;