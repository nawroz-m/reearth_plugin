import { Wrapper } from "@googlemaps/react-wrapper";
import { useEffect, useRef, useState } from "react";

const mapOptions = {
  mapId: process.env.REACT_APP_MAP_ID,
  center: { lat: 21.15, lng: 79.1 },
  zoom: 4,
  //   disableDefaultUI: true,
  mapTypeId: "satellite",
};

const SketchOnMap = () => {
  const apiKey = process.env.REACT_APP_MAP_API_KEY || "";

  return (
    <Wrapper apiKey={apiKey} version="beta" libraries={["marker"]}>
      <AppMap />
    </Wrapper>
  );
};

const AppMap = () => {
  const [map, setMap] = useState<google.maps.Map | null>();
  const mapRef = useRef<HTMLDivElement | null>(null);
  const polygonRef = useRef<google.maps.Polygon | null>(null);
  const [polygon, setPolygon] = useState<google.maps.Polygon | null>(null);

  useEffect(() => {
    setMap(new window.google.maps.Map(mapRef.current!, mapOptions));
    setPolygon(new window.google.maps.Polygon({}));
  }, []);

  useEffect(() => {
    if (polygon && map) {
      polygon.setMap(map);
      window.google.maps.event.addListener(map, "click", handleMapClick);
      window.google.maps.event.addListener(
        polygon,
        "click",
        handlePolygonClick
      );
    }
  }, [polygon, map]);

  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    const { latLng } = event;
    // console.log("Latitude: ", latLng.lat());
    const path = polygon!.getPath();
    path.push(latLng);
    console.log({ path });
  };

  const handlePolygonClick = (event: google.maps.PolyMouseEvent) => {
    const { latLng } = event;
    console.log({ latLng });
  };

  return (
    <>
      <div ref={mapRef} style={{ width: "100%", height: "100vh" }} />
    </>
  );
};

export default SketchOnMap;
