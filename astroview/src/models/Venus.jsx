import React, { useEffect, useRef } from "react";
import { useGLTF } from "@react-three/drei";

function Venus(props) {
	const group = useRef();
	const { nodes, materials } = useGLTF("/Venus.glb");

	useEffect(() => {
		console.log("🪐 Venus model loaded:", nodes, materials);
	}, [nodes, materials]);

	const meshNode = Object.values(nodes).find((n) => n?.geometry);
	const material = materials?.Venus || Object.values(materials)[0];

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

useGLTF.preload("/Venus.glb");

export default Venus;
