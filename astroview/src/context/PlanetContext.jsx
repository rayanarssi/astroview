import { createContext, useContext, useMemo, useState } from "react";

const PlanetCtx = createContext(null);

export function PlanetProvider({ children }) {
  const [selectedId, setSelectedId] = useState(null);
  const [hoverId, setHoverId] = useState(null);

  const value = useMemo(
    () => ({
      selectedId,
      setSelectedId,
      hoverId,
      setHoverId,
      clearSelected: () => setSelectedId(null),
    }),
    [selectedId, hoverId]
  );

  return <PlanetCtx.Provider value={value}>{children}</PlanetCtx.Provider>;
}

export const usePlanet = () => useContext(PlanetCtx);
