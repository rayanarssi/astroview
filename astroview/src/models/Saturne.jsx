import React, { useEffect, useRef } from "react";
import { useGLTF } from "@react-three/drei";

function Saturn(props) {
	const group = useRef();
	const { nodes, materials } = useGLTF("/Saturne.glb");

	useEffect(() => {
		console.log("🪐 Saturn (Saturne.glb) loaded:", nodes, materials);
	}, [nodes, materials]);

	const meshNode = Object.values(nodes).find((n) => n?.geometry);
	const material =
		materials?.Saturn || materials?.Saturne || Object.values(materials)[0];

	return (
		<group
			ref={group}
			{...props}
			dispose={null}
			scale={0.75}
			position={[0, -1, 0]}
			rotation={[45.5, 0, 0]}
		>
			{meshNode && <mesh geometry={meshNode.geometry} material={material} />}
		</group>
	);
}

useGLTF.preload("/Saturne.glb");

export default Saturn;
