import { useEffect } from "react";
import { useMap } from "react-leaflet";

interface FlyToUserProps {
  location: [number, number];
}

export default function FlyToUser({ location }: FlyToUserProps) {
  const map = useMap();

  useEffect(() => {
    map.flyTo(location, 15);
  }, [location, map]);

  return null;
}

