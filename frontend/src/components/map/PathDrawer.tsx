import { useMapEvents } from "react-leaflet";
import type { Coordinate } from "../../types/geo";

function PathDrawer({
  onAddPoint,
}: {
  onAddPoint: (point: Coordinate) => void;
}) {
  useMapEvents({
    click(e) {
      onAddPoint([e.latlng.lat, e.latlng.lng]);
    },
  });

  return null;
}

export default PathDrawer;