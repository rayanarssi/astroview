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

			<OrbitControls enablePan={false} />
		</Canvas>
	);
}
