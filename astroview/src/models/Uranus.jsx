import React, { useEffect, useRef } from "react";
import { useGLTF } from "@react-three/drei";

function Uranus(props) {
	const group = useRef();
	const { nodes, materials } = useGLTF("models/Uranus.glb");

	useEffect(() => {
		console.log("🪐 Uranus model loaded:", nodes, materials);
	}, [nodes, materials]);

	const meshNode = Object.values(nodes).find((n) => n?.geometry);
	const material = materials?.Uranus || Object.values(materials)[0];

	return (
		<group ref={group} {...props} dispose={null}>
			{meshNode && (
				<mesh
					geometry={meshNode.geometry}
					material={material}
					rotation={[45.5, 0, 0]}
				/>
			)}
		</group>
	);
}

useGLTF.preload("/models/Uranus.glb");

export default Uranus;
