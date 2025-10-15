import React, { useEffect, useRef } from "react";
import { useGLTF } from "@react-three/drei";

function Sun(props) {
	const group = useRef();
	const { nodes, materials } = useGLTF("/models/Sun.glb");

	useEffect(() => {
		console.log("☀️ Sun model loaded:", nodes, materials);
	}, [nodes, materials]);

	return (
		<group ref={group} {...props} dispose={null}>
			<mesh
				geometry={
					nodes?.Sphere_001?.geometry || Object.values(nodes)[0]?.geometry
				}
				material={materials?.Sun || Object.values(materials)[0]}
				rotation={[45.5, 0, 0]}
			/>
		</group>
	);
}

useGLTF.preload("/models/Sun.glb");

export default Sun;
