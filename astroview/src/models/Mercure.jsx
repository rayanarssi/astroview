import React, { useEffect, useRef } from "react";
import { useGLTF } from "@react-three/drei";

function Mercury(props) {
	const group = useRef();
	const { nodes, materials } = useGLTF("models/Mercure.glb");

	useEffect(() => {
		console.log("🪐 Mercury (Mercure.glb) loaded:", nodes, materials);
	}, [nodes, materials]);

	const meshNode = Object.values(nodes).find((n) => n?.geometry);
	const material = materials?.Mercury || Object.values(materials)[0];

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

useGLTF.preload("/models/Mercure.glb");
export default Mercury;
