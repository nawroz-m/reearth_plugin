import { useEffect, useRef, useState } from "react";

const mapOptions = {
  mapId: process.env.REACT_APP_MAP_ID,
  center: { lat: 21.15, lng: 79.1 },
  zoom: 4,
  //   disableDefaultUI: true,
  mapTypeId: "satellite",
};

interface WeatherData {
  name: string;
  position: { lat: number; lng: number };
  climate: string;
  temp: number;
  icon: string;
}

function MyMap(props: any) {
  const weatherData = props.weatherData;
  const [map, setMap] = useState<google.maps.Map | undefined>();
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    setMap(new window.google.maps.Map(ref.current!, mapOptions));
  }, []);

  // Function to add custom markers to the map
  const addCustomMarkers = (data: typeof weatherData) => {
    weatherData.map((weather: any) => {
      const marker = new window.google.maps.Marker({
        position: weather.position,
        map,
        title: weather.name,

        icon: {
          url: weather.icon,
          scaledSize: new window.google.maps.Size(40, 40), // Customize the size as needed
        },
      });
      // Content of the InfoWindow
      const content = `<div class="infoContent">
      <div>City: ${weather.name}</div>
      <div>Current Weather: ${weather.climate}</div>
      <div>Temperature: ${weather.temp} *f</div>
      </div>`;

      const infoWindow = new window.google.maps.InfoWindow({
        content: content,
      });

      marker.addListener("click", () => {
        infoWindow.open(map, marker); // Open the InfoWindow at the marker position
      });
    });
  };

  // Call addCustomMarkers to add custom markers to the map
  useEffect(() => {
    if (map) {
      addCustomMarkers(weatherData);
    }
  }, [map]);
  return (
    <>
      <div ref={ref} style={{ width: "100%", height: "100vh" }} />
    </>
  );
}

export default MyMap;
