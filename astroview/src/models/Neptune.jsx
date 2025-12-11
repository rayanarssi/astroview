import React, { useEffect, useRef } from "react";
import { useGLTF } from "@react-three/drei";

function Neptune(props) {
	const group = useRef();
	const { nodes, materials } = useGLTF("/Neptune.glb");

	useEffect(() => {
		console.log("🪐 Neptune model loaded:", nodes, materials);
	}, [nodes, materials]);

	const meshNode = Object.values(nodes).find((n) => n?.geometry);
	const material = materials?.Neptune || Object.values(materials)[0];

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

useGLTF.preload("/Neptune.glb");

export default Neptune;
