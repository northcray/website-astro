import {
  type FillLayer,
  Layer,
  Source,
  type SourceProps,
} from "react-map-gl/maplibre";

const base = "https://northcray.org";

const sourceProps: SourceProps = {
  id: "land-registry-layer",
  type: "vector",
  minzoom: 12,
  maxzoom: 14,
  tiles: [`pmtiles://${base}/cadastral_parcels.pmtiles/{z}/{x}/{y}/`],
};

const layerStyle: FillLayer = {
  id: "land-registry",
  source: "land-registry-layer",
  "source-layer": "cadastral_parcels",
  type: "fill",
  paint: {
    "fill-outline-color": "#093ee8",
    "fill-color": "rgba(0,0,0,0)",
    "fill-opacity": 0.5,
  },
};

export const LandRegistryLayer = () => {
  return (
    <Source {...sourceProps}>
      <Layer {...layerStyle} />
    </Source>
  );
};
