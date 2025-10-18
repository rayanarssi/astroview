import { useRef, useMemo, useEffect } from "react";
import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { usePlanet } from "../context/PlanetContext.jsx";
import { ModelMap } from "../models";
import gsap from "gsap";

export default function Planet({ item, angle, radius = 8.5, focusX = -3 }) {
	const group = useRef();
	const { selectedId, hoveredId, setSelected, setHovered, clearHovered } =
		usePlanet();

	const isHovered = hoveredId === item.id;
	const isSelected = selectedId === item.id;
	const isDimmed = selectedId && selectedId !== item.id;

	// position on the ring (XZ plane) around the origin (Sun at [0,0,0])
	const basePos = useMemo(
		() => [Math.cos(angle) * radius, 0, Math.sin(angle) * radius],
		[angle, radius]
	);

	const baseScale = item.scale ?? 0.4;
	const Model = ModelMap[item.id];

	const focus = () => {
		setSelected(item.id);
		gsap.to(group.current.position, {
			duration: 1.1,
			x: focusX,
			y: 0,
			z: 0,
			ease: "power3.out",
		});
		gsap.to(group.current.scale, {
			duration: 1.1,
			x: 0.9,
			y: 0.9,
			z: 0.9,
			ease: "power3.out",
		});
		gsap.to(group.current.rotation, {
			duration: 1.1,
			y: 0,
			ease: "power3.out",
		});
	};

	const resetPosition = () => {
		gsap.to(group.current.position, {
			duration: 0.9,
			x: basePos[0],
			y: 0,
			z: basePos[2],
			ease: "power3.inOut",
		});
		gsap.to(group.current.scale, {
			duration: 0.9,
			x: baseScale,
			y: baseScale,
			z: baseScale,
			ease: "power3.inOut",
		});
	};
	group.current && (group.current.resetPosition = resetPosition);

	const setOpacity = (alpha = 1) => {
		group.current.traverse((obj) => {
			if (obj.isMesh && obj.material) {
				obj.material.transparent = true;
				gsap.to(obj.material, {
					duration: 0.4,
					opacity: alpha,
					ease: "power2.out",
				});
			}
		});
	};

	useEffect(() => {
		if (!group.current) return;
		if (isDimmed) setOpacity(0.25);
		else setOpacity(1);
	}, [isDimmed]);

	useFrame((_, delta) => {
		if (isSelected && group.current) group.current.rotation.y += delta * 0.3;
	});

	return (
		<group
			ref={group}
			position={basePos}
			scale={[baseScale, baseScale, baseScale]}
			onPointerOver={(e) => {
				e.stopPropagation();
				setHovered(item.id);
			}}
			onPointerOut={() => clearHovered()}
			onClick={(e) => {
				e.stopPropagation();
				focus();
			}}
		>
			{Model ? (
				<Model />
			) : (
				<mesh>
					<sphereGeometry args={[1, 32, 32]} />
					<meshStandardMaterial color="gray" />
				</mesh>
			)}

			{isHovered && !isSelected && (
				<Html
					distanceFactor={8}
					transform
					position={[0, 1.2, 0]}
					style={{
						padding: "6px 10px",
						background: "rgba(0,0,0,0.6)",
						border: "1px solid rgba(255,255,255,0.35)",
						borderRadius: "12px",
						fontSize: 12,
						pointerEvents: "none",
					}}
				>
					<b>{item.name}</b>
				</Html>
			)}
		</group>
	);
}
