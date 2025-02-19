"use client";

import { fetchTemperature } from "@/actions/weather/weather.action";
import useGeoLocation from "@/hooks/useGeoLocation";
import { useQuery } from "@tanstack/react-query";
import React from "react";

const Weather = ({ disable }: { disable?: boolean }) => {
  const { lat, long } = useGeoLocation();

  const {
    data: weather,
    isLoading,
    error,
  } = useQuery({
    enabled: !disable,
    queryKey: [`${lat}-${long}`],
    queryFn: () =>
      fetchTemperature({
        lat,
        long,
      }),
  });

  const temperature = weather?.weather?.temp.cur;

  if (
    isLoading ||
    isNaN(temperature) ||
    typeof temperature !== "number" ||
    error
  ) {
    return <></>;
  }

  return (
    <span>
      {temperature
        ? (((temperature - 32) * 5) / 9).toFixed(1) + "°C"
        : "Loading..."}
    </span>
  );
};

export default Weather;
