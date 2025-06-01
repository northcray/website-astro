import {
  Layer,
  Source,
  type LineLayerSpecification,
} from "react-map-gl/maplibre";

import data from "./ward.json";

const layerStyle: LineLayerSpecification = {
  id: "ward",
  source: "ward-layer",
  type: "line",
  paint: {
    "line-color": "#007cbf",
    "line-width": 2,
  },
};

export const WardLayer = () => {
  return (
    <Source id="ward-layer" type="geojson" data={data as any}>
      <Layer {...layerStyle} />
    </Source>
  );
};
