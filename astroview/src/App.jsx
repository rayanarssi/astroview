import { Suspense, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { Stars, Environment, OrbitControls } from "@react-three/drei";

import SolarScene from "./components/SolarScene.jsx";
import InfoPanel from "./components/InfoPanel.jsx";
import { usePlanet } from "./context/PlanetContext.jsx";

import "./styles.css";

export default function App() {
  const { selectedId, clearSelected } = usePlanet();
  const controlsRef = useRef(null);

  return (
    <div className="app">
      {/* Top bar */}
      <header className="topbar">
        <div className="brand">AstroView</div>
      </header>

      {/* Single Canvas */}
      <Canvas
        camera={{ position: [0, 2.8, 14], fov: 45 }}
        onPointerMissed={(e) => {
          // If you click empty space (not on meshes), clear selection via backdrop instead
          // We still keep this so stray clicks don’t keep hover stuck.
          e.stopPropagation();
        }}
      >
        <color attach="background" args={["#05060a"]} />
        <Stars radius={80} depth={50} count={3500} factor={4} fade speed={1} />
        <ambientLight intensity={0.3} />
        <pointLight position={[0, 0, 0]} intensity={3} distance={80} decay={2} />

        <Suspense fallback={null}>
          <SolarScene />
        </Suspense>

        {/* IMPORTANT: makeDefault lets SolarScene's Dolly read controls from the R3F store */}
        <OrbitControls
          ref={controlsRef}
          makeDefault
          enableRotate
          enableZoom
          enablePan
          target={[0, 0, 0]}
        />
        <Environment preset="city" />
      </Canvas>

      {/* DOM overlays */}
      <main className="main">
        <div
          className={`backdrop ${selectedId ? "show" : ""}`}
          onClick={clearSelected}
          aria-hidden="true"
        />
        <InfoPanel />
      </main>
    </div>
  );
}
