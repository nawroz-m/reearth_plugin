import React, { useEffect, useRef, useState } from "react";
import { FeatureCollection } from "geojson";

import {
  DrawingManager,
  GoogleMap,
  Polygon,
  useJsApiLoader,
} from "@react-google-maps/api";

type Library = "places" | "drawing";

const defaultCenter = {
  lat: 21.15,
  lng: 79.1,
};

const clearAllBtnStl: React.CSSProperties = {
  cursor: "pointer",
  width: "24px",
  marginTop: "2px",
  backgroundColor: "white",
  position: "absolute",
  top: "2px",
  left: "57.65%",
  zIndex: 99999,
  color: "#9d9d9d",
  minWidth: "75px",
  paddingLeft: "4px",
  paddingTop: "2px",
  paddingBottom: "4px",
  background: "black",
  borderRadius: "3px",
};
const exportDataBtnStl: React.CSSProperties = {
  cursor: "pointer",
  width: "24px",
  marginTop: "2px",
  backgroundColor: "white",
  position: "absolute",
  top: "2px",
  left: "63.5%",
  zIndex: 99999,
  color: "#9d9d9d",
  minWidth: "60px",
  paddingLeft: "4px",
  paddingTop: "2px",
  paddingBottom: "4px",
  background: "black",
  borderRadius: "3px",
};

const polygonOptions = {
  fillOpacity: 0.09,
  fillColor: "rgba(255, 153, 0, 1)",
  strokeColor: "rgba(255, 153, 0, 1)",
  strokeWeight: 1,
  draggable: false,
  editable: true,
};

const libraries: Library[] = ["places", "drawing"];

const SketchOnMap = () => {
  const mapRef = useRef<google.maps.Map>();
  const polygonRefs = useRef<google.maps.Polygon | []>([]);
  const activePolygonIndex = useRef<number | null>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const drawingManagerRef = useRef<google.maps.drawing.DrawingManager | null>(
    null
  );
  const [polygons, setPolygons] = useState<
    Array<{ lat: number; lng: number }[]>
  >([]);
  const [geoJson, setGeoJson] = useState<FeatureCollection[]>([]);

  const mapApiKey = process.env.REACT_APP_MAP_API_KEY || "";
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: mapApiKey,
    libraries,
  });
  const [center, setCenter] = useState(defaultCenter);
  const drawingManagerOptions: google.maps.drawing.DrawingManagerOptions = {
    polygonOptions: polygonOptions,
    drawingControl: true,
    drawingControlOptions: {
      position: window.google?.maps?.ControlPosition?.TOP_CENTER,
      drawingModes: [
        window.google?.maps?.drawing?.OverlayType?.POLYGON,
        window.google?.maps?.drawing?.OverlayType?.POLYLINE,
        window.google?.maps?.drawing?.OverlayType?.MARKER,
      ] as google.maps.drawing.OverlayType[],
    },
    polylineOptions: {
      strokeColor: `#ffff`,
      strokeOpacity: 1,
      strokeWeight: 1,
      clickable: false,
      editable: true,
      zIndex: 1,
    },
    markerOptions: {
      icon: "regular.png",
    },
  };

  const onLoadMap = (map: any) => {
    mapRef.current = map;
  };

  const onLoadPolygon = (polygon: google.maps.Polygon, index: number) => {
    polygonRefs.current = polygon;
  };

  const onClickPolygon = (index: number) => {
    activePolygonIndex.current = index;
  };

  const onLoadDrawingManager = (drawingManager: any) => {
    drawingManagerRef.current = drawingManager;
  };

  const onOverlayComplete = async ($overlayEvent: any) => {
    const geoJsonArr: any = [];
    drawingManagerRef.current?.setDrawingMode(null);
    if ($overlayEvent.type === window.google.maps.drawing.OverlayType.POLYGON) {
      const newPolygon = $overlayEvent.overlay
        .getPath()
        .getArray()
        .map((latLng: any) => {
          geoJsonArr.push([latLng.lat(), latLng.lng()]);
          return { lat: latLng.lat(), lng: latLng.lng() };
        });

      // start and end point should be same for valid geojson
      const startPoint = newPolygon[0];
      const startGeoJsonPoint = geoJsonArr[0];
      geoJsonArr.push(startGeoJsonPoint);
      newPolygon.push(startPoint);
      // $overlayEvent.overlay?.setMap(null);

      setPolygons([...polygons, newPolygon]);
      const GeoJson: FeatureCollection = {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            properties: {},
            geometry: {
              type: "Polygon",
              coordinates: [geoJsonArr],
            },
          },
        ],
      };

      const geoJsonShallowAdd = [...geoJson, GeoJson];

      setGeoJson(geoJsonShallowAdd);
    }
    if (
      $overlayEvent.type === window.google.maps.drawing.OverlayType.POLYLINE
    ) {
      const newPoyline = $overlayEvent.overlay
        .getPath()
        .getArray()
        .map((latLng: any) => {
          geoJsonArr.push([latLng.lat(), latLng.lng()]);
          return { lat: latLng.lat(), lng: latLng.lng() };
        });

      $overlayEvent.overlay?.setMap(null);

      setPolygons([newPoyline]);
      const GeoJson: FeatureCollection = {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            properties: {},
            geometry: {
              type: "Polygon",
              coordinates: [geoJsonArr],
            },
          },
        ],
      };

      const geoJsonShallowAdd = [...geoJson, GeoJson];

      setGeoJson(geoJsonShallowAdd);
    }
  };

  const onEditPolygon = (index: any): void => {
    const polygonRef = polygonRefs.current;
    if (polygonRef instanceof google.maps.Polygon) {
      if (polygonRef) {
        const coordinates = polygonRef.getPath();
        const arrays = coordinates.getArray();
        const geoJsonArr: any = [];
        const finallCoordinates = arrays.map((latLng) => {
          geoJsonArr.push([latLng.lat(), latLng.lng()]);
          return {
            lat: latLng.lat(),
            lng: latLng.lng(),
          };
        });

        const allPolygons = [...polygons];
        allPolygons[index] = finallCoordinates;

        setPolygons(allPolygons);
        const GeoJson: FeatureCollection = {
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              properties: {},
              geometry: {
                type: "Polygon",
                coordinates: [geoJsonArr],
              },
            },
          ],
        };
        const geoJsonShallowAdd = [...geoJson];
        geoJsonShallowAdd[index] = GeoJson;
        setGeoJson(geoJsonShallowAdd);
      }
    }
    if (polygonRef instanceof google.maps.Polyline) {
      if (polygonRef) {
        const coordinates = polygonRef.getPath();
        const arrays = coordinates.getArray();
        const geoJsonArr: any = [];
        const finallCoordinates = arrays.map((latLng) => {
          geoJsonArr.push([latLng.lat(), latLng.lng()]);
          return {
            lat: latLng.lat(),
            lng: latLng.lng(),
          };
        });

        const allPolygons = [...polygons];
        allPolygons[index] = finallCoordinates;

        setPolygons(allPolygons);
        const GeoJson: FeatureCollection = {
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              properties: {},
              geometry: {
                type: "Polygon",
                coordinates: [geoJsonArr],
              },
            },
          ],
        };
        const geoJsonShallowAdd = [...geoJson];
        geoJsonShallowAdd[index] = GeoJson;
        setGeoJson(geoJsonShallowAdd);
      }
    }
  };

  const onDeleteDrawing = () => {
    setPolygons([]);
    setGeoJson([]);
  };

  const exportData = () => {
    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
      JSON.stringify(geoJson)
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = "geoJsonData.geojson";

    link.click();
  };

  return isLoaded ? (
    <div className="map-container" style={{ position: "relative" }}>
      {drawingManagerRef.current && (
        <>
          <div
            onClick={onDeleteDrawing}
            title="Delete shape"
            style={clearAllBtnStl}
          >
            {" "}
            Clear All
          </div>
          <div onClick={exportData} title="Export all" style={exportDataBtnStl}>
            {" "}
            Export
          </div>
        </>
      )}

      <GoogleMap
        mapContainerClassName="google_map_container"
        zoom={15}
        center={center}
        onLoad={onLoadMap}
        onTilesLoaded={() => setCenter(defaultCenter)}
      >
        <DrawingManager
          onLoad={onLoadDrawingManager}
          onOverlayComplete={onOverlayComplete}
          options={drawingManagerOptions}
        />
        {polygons.map((iterator, index) => {
          return (
            <Polygon
              key={index}
              onLoad={(event) => onLoadPolygon(event, index)}
              onMouseDown={() => onClickPolygon(index)}
              onMouseUp={() => onEditPolygon(index)}
              onDragEnd={() => onEditPolygon(index)}
              options={polygonOptions}
              paths={iterator}
              draggable
              editable
            />
          );
        })}
      </GoogleMap>
    </div>
  ) : null;
};

export default SketchOnMap;
