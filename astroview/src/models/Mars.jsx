import React, { useEffect, useRef } from "react";
import { useGLTF } from "@react-three/drei";

function Mars(props) {
	const group = useRef();
	const { nodes, materials } = useGLTF("models/Mars.glb");

	useEffect(() => {
		console.log("🪐 Mars model loaded:", nodes, materials);
	}, [nodes, materials]);

	const meshNode = Object.values(nodes).find((n) => n?.geometry);
	const material = materials?.Mars || Object.values(materials)[0];

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

useGLTF.preload("/models/Mars.glb");

export default Mars;
