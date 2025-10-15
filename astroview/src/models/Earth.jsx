import React, { useEffect, useRef } from "react";
import { useGLTF } from "@react-three/drei";

function Earth(props) {
	const group = useRef();
	const { nodes, materials } = useGLTF("/models/Earth.glb");

	useEffect(() => {
		console.log("🌍 Earth model loaded:", nodes);
	}, [nodes]);

	return (
		<group ref={group} {...props} dispose={null}>
			<mesh
				geometry={nodes.Sphere_003.geometry}
				material={materials.Earth}
				rotation={[45.5, 0, 0]}
			/>
		</group>
	);
}

useGLTF.preload("/models/Earth.glb");

export default Earth;
