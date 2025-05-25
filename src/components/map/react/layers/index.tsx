import { LandRegistryLayer } from "./LandRegistry";
import { WardLayer } from "./Ward";
import { useState } from "react";

const layers = [
  { value: "ward", label: "Ward boundary" },
  { value: "land-registry", label: "Land registry" },
];

export const Layers = () => {
  const [visibleLayers, setVisibleLayers] = useState<string[]>([
    "ward",
    "land-registry",
  ]);

  return (
    <div className="relative container mx-auto">
      <div className="absolute top-8 left-0 bg-white p-4 rounded-lg shadow-lg z-10">
        <h2 className="text-lg font-bold mb-2 uppercase mt-0 p-0">
          Map layers
        </h2>
        <form>
          {layers.map(({ value, label }) => (
            <div key={value}>
              <label className="flex items-center gap-2 text-base">
                <input
                  type="checkbox"
                  value={value}
                  checked={!!visibleLayers.includes(value)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setVisibleLayers([...visibleLayers, value]);
                    } else {
                      setVisibleLayers(
                        visibleLayers.filter((v) => v !== value),
                      );
                    }
                  }}
                />
                {label}
              </label>
            </div>
          ))}
        </form>
        {visibleLayers.includes("ward") && <WardLayer />}
        {visibleLayers.includes("land-registry") && <LandRegistryLayer />}
      </div>
    </div>
  );
};
