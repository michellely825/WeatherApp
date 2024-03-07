import axios from "axios";

export type Coordinates={
    lat:number,
    lon:number,
}

export type WeeklyWeather={
    date:Date,
    max:number,
    min:number,
    icon:number,
}

export type TodaysWeather={
    city:string;
    country:string;
    description:string;
    date:Date,
    sunrise:Date,
    sunset:Date,
    temp:number;
    max:number,
    min:number,
    icon:number,
}

export const getCoords = async (city: string) => { 
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=7fcec942249fb43b45edd62ab7ead6a9`
    
    try{
        const response = await axios.get(url)
        const dataLat = response.data.coord.lat
        const dataLon = response.data.coord.lon

        const coords: Coordinates = {
            lat: dataLat,
            lon: dataLon
        };
        return coords;
    } catch (error) {
        console.log(error)
        throw new Error("Failed to fetch latitutde and longitutde");
    }
}

export const getTodaysWeather = async (lat: number, lon: number) => {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=7fcec942249fb43b45edd62ab7ead6a9`
    try {
        const response = await axios.get(url)
        const data = response.data
        console.log('todays', data)
        const todaysData: TodaysWeather = {
            city: data.name,
            country: data.sys.country,
            description: data.weather[0].description,
            date: new Date(data.dt * 1000),
            sunrise: new Date(data.sys.sunrise * 1000),
            sunset: new Date(data.sys.sunset * 1000),
            temp: data.main.temp,
            max: data.main.temp_max,
            min: data.main.temp_min,
            icon: data.weather[0].icon,
        };
        return todaysData;
        
    } catch (e) {
        throw new Error("Failed to fetch today's weather")
    }
}

export const getWeeklyWeather = async (lat: number, lon: number) => {
    const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=hourly,minutely&appid=7fcec942249fb43b45edd62ab7ead6a9`
    try {
        const response =  await axios.get(url)
        const dailyWeather = response.data.daily
        console.log('dailyweather:,', dailyWeather)
        const output_results = []
        for (const weather of dailyWeather) {
            // console.log('max & min:', weather.temp.max, weather.temp.min)
            const weeklydata: WeeklyWeather={
                date: new Date(weather.dt * 1000),
                max: weather.temp.max,
                min: weather.temp.min,
                icon: weather.weather[0].icon,
            };
            output_results.push(weeklydata)
        }
        return output_results
    } catch (error) {
        console.log(error)
        throw new Error("Failed to weekly weather")
    }
}

