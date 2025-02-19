import { useEffect, useState } from "react";

export default function useGeoLocation() {
  const [cord, setCord] = useState({
    lat: 0,
    long: 0,
  });

  useEffect(() => {
    if (window) {
      try {
        navigator.geolocation.getCurrentPosition((position) => {
          setCord({
            lat: position.coords.latitude,
            long: position.coords.longitude,
          });
        });
      } catch (error) {
        console.log("device does not support geo location");
      }
    }
  }, []);

  return {
    lat: cord.lat,
    long: cord.long,
  };
}
