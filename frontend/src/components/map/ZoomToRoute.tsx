import type { Coordinate } from "../../types/geo";
import { useMap } from "react-leaflet";
import { useEffect } from "react";

function ZoomToRoute({ route }: { route: Coordinate[] }) {
  const map = useMap();

  useEffect(() => {
    if (route.length === 0) return;

    map.fitBounds(route, {
      padding: [40, 40],
    });
  }, [route, map]);

  return null;
}

export default ZoomToRoute;