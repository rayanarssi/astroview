import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, Stars } from "@react-three/drei";
import OrbitSystem from "../3d/systems/OrbitSystem.jsx";
import Planet from "./Planet.jsx";
import data from "../data/planets.json";

export default function SolarScene() {
	const sun = data.find((p) => p.id === "sun");

	return (
		<Canvas camera={{ position: [0, 5, 12], fov: 45 }}>
			{/* background + lights */}
			<color attach="background" args={["#000011"]} />
			<ambientLight intensity={0.4} />
			<directionalLight position={[5, 5, 5]} intensity={1.2} />
			<Environment preset="sunset" />
			<Stars radius={50} depth={80} count={5000} factor={4} saturation={0} />

			{/* SUN */}
			<group userData={{ pid: sun.id }}>
				<Planet path={sun.model} scale={sun.scale} />
			</group>

			{/* MERCURY & VENUS */}
			{["mercury", "venus"].map((id, i) => {
				const p = data.find((x) => x.id === id);
				const radius = 4 + i * 1.6; // 4, 5.6
				const speed = 0.6 + i * 0.1; // 0.6, 0.7
				return (
					<OrbitSystem key={id} radius={radius} speed={speed}>
						<group userData={{ pid: p.id }}>
							<Planet path={p.model} scale={p.scale} />
						</group>
					</OrbitSystem>
				);
			})}

			{/* EARTH & MARS */}
			{["earth", "mars"].map((id, i) => {
				const p = data.find((x) => x.id === id);
				const radius = 7.2 + i * 1.8; // 7.2, 9.0
				const speed = 0.5 + i * 0.08; // 0.5, 0.58
				return (
					<OrbitSystem key={id} radius={radius} speed={speed}>
						<group userData={{ pid: p.id }}>
							<Planet path={p.model} scale={p.scale} />
						</group>
					</OrbitSystem>
				);
			})}

			{/* JUPITER & SATURN */}
			{["jupiter", "saturn"].map((id, i) => {
				const p = data.find((x) => x.id === id);
				const radius = 11 + i * 2.6; // 11, 13.6
				const speed = 0.35 + i * 0.06; // 0.35, 0.41
				return (
					<OrbitSystem key={id} radius={radius} speed={speed}>
						<group userData={{ pid: p.id }}>
							<Planet path={p.model} scale={p.scale} />
						</group>
					</OrbitSystem>
				);
			})}

			{/* URANUS & NEPTUNE */}
			{["uranus", "neptune"].map((id, i) => {
				const p = data.find((x) => x.id === id);
				const radius = 16 + i * 2.4; // 16, 18.4
				const speed = 0.28 + i * 0.05; // 0.28, 0.33
				return (
					<OrbitSystem key={id} radius={radius} speed={speed}>
						<group userData={{ pid: p.id }}>
							<Planet path={p.model} scale={p.scale} />
						</group>
					</OrbitSystem>
				);
			})}

			<OrbitControls enablePan={false} />
		</Canvas>
	);
}
