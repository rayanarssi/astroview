import { Suspense, useMemo } from "react";
import { useGLTF } from "@react-three/drei";

function PlanetMesh({ path, scale = 1 }) {
	const { scene } = useGLTF(path, true);
	const clone = useMemo(() => scene.clone(true), [scene]);
	return <primitive object={clone} scale={scale} />;
}

export default function Planet({ path, scale }) {
	return (
		<Suspense fallback={null}>
			<PlanetMesh path={path} scale={scale} />
		</Suspense>
	);
}
