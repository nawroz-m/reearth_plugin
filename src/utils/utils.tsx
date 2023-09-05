const geocode = async (cityNames: any[]) => {
  const weatherData: any = [];
  const apiKy = process.env.REACT_APP_WEATHER_API_KEY;
  try {
    cityNames.map(async (city, idx) => {
      const weatherInfoRes = await fetch(
        `http://api.weatherapi.com/v1/current.json?q=${city}&key=${apiKy}`
      );
      if (weatherInfoRes.statusText === "OK") {
        const wData = await weatherInfoRes.json();
        const data = {
          name: wData && wData.location.name,
          position: {
            lat: wData && wData.location.lat,
            lng: wData && wData.location.lon,
          },
          climate: wData && wData.current.condition.text,
          icon: wData && wData.current.condition.icon,
          temp: wData && wData.current.temp_f,
        };
        weatherData.push(data);
      }
    });
  } catch (err) {
    return {
      err: true,
      data: err,
    };
  }

  return {
    err: false,
    data: weatherData,
  };
};

export { geocode };
