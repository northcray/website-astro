import { Layers } from "./layers";
import Map, {
  NavigationControl,
  Popup,
  ScaleControl,
  type MapLayerMouseEvent,
} from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import maplibregl from "maplibre-gl";
import { useEffect, useState } from "react";
import { Protocol } from "pmtiles";

// const styleUrl = `https://api.maptiler.com/maps/landscape/style.json?key=ynz58rRjiygeONss49bn`;
const styleUrl = `https://api.maptiler.com/maps/bright-v2/style.json?key=ynz58rRjiygeONss49bn`;

export default function Maps() {
  const [selectedFeature, setSelectedFeature] = useState<{
    data: object;
    coordinates: { lng: number; lat: number };
  } | null>(null);
  const [viewState, setViewState] = useState({
    longitude: 0.14487,
    latitude: 51.42678,
    zoom: 13.63,
  });

  const [pmTilesReady, setPmTilesReady] = useState(false);

  useEffect(() => {
    const protocol = new Protocol();
    maplibregl.addProtocol("pmtiles", protocol.tile);
    setPmTilesReady(true);
  }, []);

  const handleMapClick = (event: MapLayerMouseEvent) => {
    const { features, lngLat } = event;

    // Filter for polygons only
    const polygon = features?.find((f) => f.geometry.type === "Polygon");

    if (polygon) {
      setSelectedFeature({
        data: polygon.properties, // feature data
        coordinates: lngLat, // click location
      });
    } else {
      setSelectedFeature(null); // Hide tooltip if no polygon is clicked
    }
  };

  return (
    <Map
      initialViewState={viewState}
      style={{ width: "100vw", height: "calc(100vh - 56px)" }}
      {...viewState}
      onMove={(evt) => setViewState(evt.viewState)}
      mapStyle={styleUrl}
      onClick={handleMapClick}
      interactiveLayerIds={["land-registry"]}
    >
      {pmTilesReady && <Layers />}
      <NavigationControl />
      <ScaleControl />

      {selectedFeature && (
        <Popup
          maxWidth="500px"
          longitude={selectedFeature.coordinates.lng}
          latitude={selectedFeature.coordinates.lat}
          anchor="bottom"
          onClose={() => setSelectedFeature(null)}
        >
          <code>{JSON.stringify(selectedFeature.data, null, 2)}</code>
        </Popup>
      )}
    </Map>
  );
}
