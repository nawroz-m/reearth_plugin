import React, { useEffect, useRef, useState } from "react";
import { Wrapper } from "@googlemaps/react-wrapper";
import { cityNames } from "../constant/Const";
import { geocode } from "../utils/utils";
import MyMap from "./MyMap";

export default function IndiaWeather() {
  const [weatherData, setWeatherData] = useState<any>([]);
  const apiKey = process.env.REACT_APP_MAP_API_KEY || "";
  const featchAllCityWeather = async () => {
    const response = await geocode(cityNames);
    if (response && !response.err) {
      setWeatherData(response.data);
    }
  };
  useEffect(() => {
    // Perform an initial geocode when the component mounts
    featchAllCityWeather();
  }, []);
  return (
    <Wrapper apiKey={apiKey} version="beta" libraries={["marker"]}>
      <MyMap weatherData={weatherData} />
    </Wrapper>
  );
}
