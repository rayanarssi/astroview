import { createContext, useContext, useState, useMemo } from "react";

const PlanetCtx = createContext(null);

export function PlanetProvider({ children }) {
  const [selectedId, setSelectedId] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);

  const value = useMemo(
    () => ({
      selectedId,
      setSelectedId,
      clearSelected: () => setSelectedId(null),
      hoveredId,
      setHovered: setHoveredId,
      clearHovered: () => setHoveredId(null),
    }),
    [selectedId, hoveredId]
  );

  return <PlanetCtx.Provider value={value}>{children}</PlanetCtx.Provider>;
}

export function usePlanet() {
  const ctx = useContext(PlanetCtx);
  if (!ctx) throw new Error("usePlanet must be used within PlanetProvider");
  return ctx;
}
