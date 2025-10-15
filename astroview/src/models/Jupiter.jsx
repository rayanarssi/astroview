import React, { useEffect, useRef } from "react";
import { useGLTF } from "@react-three/drei";

function Jupiter(props) {
	const group = useRef();
	const { nodes, materials } = useGLTF("/models/Jupiter.glb");

	useEffect(() => {
		console.log("🪐 Jupiter model loaded:", nodes);
	}, [nodes]);

	return (
		<group ref={group} {...props} dispose={null}>
			<mesh
				geometry={nodes.Sphere_005.geometry}
				material={materials.Jupiter}
				rotation={[45.5, 0, 0]}
			/>
		</group>
	);
}

useGLTF.preload("/models/Jupiter.glb");

export default Jupiter;
