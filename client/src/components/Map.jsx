import React, { useEffect, useRef } from "react";
import tt from "@tomtom-international/web-sdk-maps";
import axios from "axios";
const Map = ({ cityName }) => {
  const mapElement = useRef(null);
  const apiKey = "Ig5yHU6qEGaK3zlUvI9OMQVNbtZZJD9A";
  const openCageApi = `09a3967230a641fa85a6a993ce6b5e41`;
  const mapRef = useRef(null);
  useEffect(() => {
    const fetchCoordinates = () => {
      try {
        axios
          .get(
            `https://api.opencagedata.com/geocode/v1/json?q=@${cityName}&key=${openCageApi}`
          )
          .then((res) => {
            if (res.data.results && res.data.results.length > 0) {
              const { lat, lng } = res.data.results[0].geometry;

              if (!mapRef.current) {
                mapRef.current = tt.map({
                  key: apiKey,
                  container: mapElement.current,
                  center: [lng, lat],
                  zoom: 10,
                });

                new tt.Marker().setLngLat([lng, lat]).addTo(mapRef.current);
              } else {
                mapRef.current.setCenter([lng, lat]);
              }
            } else {
              console.error("No results found for the provided city name.");
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } catch (error) {
        console.error("Error fetching coordinates:", error);
      }
    };

    fetchCoordinates();
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [cityName, apiKey]);
  return (
    <div
      ref={mapElement}
      style={{
        height: "97%",
        width: "97%",
        borderRadius: "3.5rem",
        overflow: "hidden",
      }}
    />
  );
};

export default Map;