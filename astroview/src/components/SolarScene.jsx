// src/components/SolarScene.jsx
import { useThree, useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { useRef, useEffect, useMemo } from "react";
import { usePlanet } from "../context/PlanetContext.jsx";
import { ModelMap } from "../models";
import gsap from "gsap";
import data from "../data/planets.json";

/* ---- gentle spin wrapper ---- */
function SelfRotate({ speed = 0.2, children }) {
	const g = useRef();
	useFrame((_, dt) => {
		if (g.current) g.current.rotation.y += dt * speed;
	});
	return <group ref={g}>{children}</group>;
}

export default function SolarScene() {
	const {
		selectedId,
		setSelectedId,
		clearSelected,
		hoveredId,
		setHovered,
		clearHovered,
	} = usePlanet();

	const controls = useRef(); // we’ll read OrbitControls target via useThree
	const sunRef = useRef();
	const planetRefs = useRef({});
	const moonRef = useRef();
	const stateRef = useRef({}); // { [id]: { locked, snapping } }

	// global tuning
	const SIZE_MULT = 1.0;
	const ORBIT_MULT = 3.0;
	const ORBIT_SPEED_MULT = 0.08;
	const SAFE_GAP = 1.2;
	const FOCUS_POS = [-5.5, 0.2, 0.6];

	/* ---- camera dolly (runs under the single Canvas in App.jsx) ---- */
	function Dolly() {
		const { camera, controls: r3fControls } = useThree((s) => ({
			camera: s.camera,
			controls: s.controls, // available if you pass ref to <OrbitControls> in App.jsx
		}));

		useEffect(() => {
			gsap.to(camera.position, {
				duration: selectedId ? 1.1 : 0.9,
				x: selectedId ? 1.2 : 0,
				y: selectedId ? 1.0 : 2.8,
				z: selectedId ? 3.2 : 14,
				ease: selectedId ? "power3.out" : "power3.inOut",
			});

			const target = (controls.current = r3fControls || controls.current);
			if (target) {
				gsap.to(target.target, {
					duration: selectedId ? 1.1 : 0.9,
					x: selectedId ? FOCUS_POS[0] : 0,
					y: selectedId ? FOCUS_POS[1] : 0,
					z: selectedId ? FOCUS_POS[2] : 0,
					ease: selectedId ? "power3.out" : "power3.inOut",
				});
			}
		}, [selectedId, camera, r3fControls]);

		return null;
	}

	/* ---- data ---- */
	const sun = data.find((p) => p.id === "sun");
	const moon = data.find((p) => p.id === "moon");
	const planets = useMemo(
		() => data.filter((p) => p.id !== "sun" && p.id !== "moon"),
		[]
	);

	// spread start angles
	const GOLDEN = Math.PI * (3 - Math.sqrt(5));
	const baseAngles = useMemo(() => {
		const m = {};
		planets.forEach((p, i) => (m[p.id] = i * GOLDEN));
		return m;
	}, [planets]);

	// relative orbital speeds
	const speedMap = {
		mercury: 4.15,
		venus: 1.62,
		earth: 1.0,
		mars: 0.53,
		jupiter: 0.08,
		saturn: 0.03,
		uranus: 0.01,
		neptune: 0.006,
	};
	const moonSpeed = 6.0;

	/* ---- non-overlapping orbit radii ---- */
	const DESIRED_MAX = 9.0;
	const { radiiMap, radiiScale } = useMemo(() => {
		if (!planets.length) return { radiiMap: {}, radiiScale: 1 };

		const vis = Object.fromEntries(
			planets.map((p) => [p.id, (p.visScale ?? 0.4) * SIZE_MULT])
		);

		const base = planets
			.map((p) => ({ id: p.id, r: (p.orbit ?? 5) * ORBIT_MULT }))
			.sort((a, b) => a.r - b.r);

		// outward pass
		for (let i = 1; i < base.length; i++) {
			const prev = base[i - 1];
			const cur = base[i];
			const minGap = (vis[prev.id] + vis[cur.id]) * SAFE_GAP;
			if (cur.r < prev.r + minGap) cur.r = prev.r + minGap;
		}
		// inward pass
		for (let i = base.length - 2; i >= 0; i--) {
			const next = base[i + 1];
			const cur = base[i];
			const minGap = (vis[next.id] + vis[cur.id]) * SAFE_GAP;
			if (cur.r > next.r - minGap) cur.r = Math.max(next.r - minGap, 0.5);
		}

		const maxR = Math.max(...base.map((x) => x.r), 1);
		const scale = DESIRED_MAX / maxR;

		const map = {};
		base.forEach(({ id, r }) => (map[id] = r));
		return { radiiMap: map, radiiScale: scale };
	}, [planets]);

	/* ---- orbit animation ---- */
	useFrame(({ clock }) => {
		const t = clock.getElapsedTime();

		planets.forEach((p, i) => {
			const ref = planetRefs.current[p.id];
			if (!ref) return;

			const st = stateRef.current[p.id] || {};
			if (st.locked || st.snapping) return;

			const angle =
				baseAngles[p.id] + t * (speedMap[p.id] || 0.5) * ORBIT_SPEED_MULT;
			const R = (radiiMap[p.id] ?? (p.orbit || 5)) * radiiScale;
			const zLayer = (i % 2 === 0 ? 1 : -1) * 0.03;

			ref.position.set(Math.cos(angle) * R, 0, Math.sin(angle) * R + zLayer);
		});

		// moon follows earth
		if (moon && moonRef.current) {
			const earth = planets.find((p) => p.id === "earth");
			if (earth) {
				const earthR = (radiiMap["earth"] ?? (earth.orbit || 6)) * radiiScale;
				const earthAngle =
					baseAngles.earth + t * (speedMap.earth || 1) * ORBIT_SPEED_MULT;
				const ex = Math.cos(earthAngle) * earthR;
				const ez = Math.sin(earthAngle) * earthR;

				const phase = t * moonSpeed * ORBIT_SPEED_MULT;
				const rM = (moon.orbit || 0.45) * 0.65 * radiiScale;
				moonRef.current.position.set(
					ex + Math.cos(phase) * rM,
					0,
					ez + Math.sin(phase) * rM
				);
			}
		}
	});

	/* ---- helpers ---- */
	const setGroupOpacity = (group, alpha = 1) => {
		if (!group) return;
		group.traverse((obj) => {
			if (obj.isMesh && obj.material) {
				obj.material.transparent = true;
				gsap.to(obj.material, {
					duration: 0.35,
					opacity: alpha,
					ease: "power2.out",
				});
			}
		});
	};

	const getFocusScale = (id) => {
		const isSun = id === "sun";
		const s = isSun
			? (sun?.visScale ?? 0.9) * SIZE_MULT
			: (planets.find((p) => p.id === id)?.visScale ?? 0.4) * SIZE_MULT;

		let target = 1.2 / s;
		if (id === "saturn") target = 0.9 / s;
		if (id === "jupiter") target = 1.0 / s;
		if (id === "sun") target = 0.9 / s;
		return Math.min(1.8, Math.max(0.85, target));
	};

	const focusPlanet = (id) => {
		setSelectedId(id);

		// dim others
		if (id === "sun") {
			Object.values(planetRefs.current).forEach((ref) =>
				setGroupOpacity(ref, 0.15)
			);
		} else {
			if (sunRef.current) setGroupOpacity(sunRef.current, 0.15);
			Object.entries(planetRefs.current).forEach(([pid, ref]) => {
				if (pid !== id) setGroupOpacity(ref, 0.15);
			});
		}

		const ref = id === "sun" ? sunRef.current : planetRefs.current[id];
		if (!ref) return;

		stateRef.current[id] = { locked: true, snapping: false };

		gsap.to(ref.position, {
			duration: 1.1,
			x: FOCUS_POS[0],
			y: FOCUS_POS[1],
			z: FOCUS_POS[2],
			ease: "power3.out",
		});
		const hero = getFocusScale(id);
		gsap.to(ref.scale, {
			duration: 1.1,
			x: hero,
			y: hero,
			z: hero,
			ease: "power3.out",
		});
		gsap.to(ref.rotation, { duration: 1.1, y: 0, ease: "power3.out" });
	};

	// snap back on close
	useEffect(() => {
		if (selectedId !== null) return;

		const lockedId = Object.keys(stateRef.current).find(
			(k) => stateRef.current[k]?.locked
		);
		if (!lockedId) return;

		if (sunRef.current) setGroupOpacity(sunRef.current, 1);
		Object.values(planetRefs.current).forEach((ref) => setGroupOpacity(ref, 1));

		const isSun = lockedId === "sun";
		const ref = isSun ? sunRef.current : planetRefs.current[lockedId];
		if (!ref) return;

		const now = performance.now() / 1000;

		if (isSun) {
			const s = (sun?.visScale ?? 0.9) * SIZE_MULT;
			stateRef.current[lockedId] = { locked: false, snapping: true };
			gsap.to(ref.position, {
				duration: 0.9,
				x: 0,
				y: 0,
				z: 0,
				ease: "power3.inOut",
				onComplete: () =>
					(stateRef.current[lockedId] = { locked: false, snapping: false }),
			});
			gsap.to(ref.scale, {
				duration: 0.9,
				x: s,
				y: s,
				z: s,
				ease: "power3.inOut",
			});
		} else {
			const p = planets.find((pl) => pl.id === lockedId);
			if (!p) return;

			const s = (p.visScale || 0.4) * SIZE_MULT;
			const R = (radiiMap[p.id] ?? (p.orbit || 5)) * radiiScale;
			const angle =
				baseAngles[p.id] + now * (speedMap[p.id] || 0.5) * ORBIT_SPEED_MULT;

			stateRef.current[lockedId] = { locked: false, snapping: true };
			gsap.to(ref.position, {
				duration: 0.9,
				x: Math.cos(angle) * R,
				y: 0,
				z: Math.sin(angle) * R,
				ease: "power3.inOut",
				onComplete: () =>
					(stateRef.current[lockedId] = { locked: false, snapping: false }),
			});
			gsap.to(ref.scale, {
				duration: 0.9,
				x: s,
				y: s,
				z: s,
				ease: "power3.inOut",
			});
		}
	}, [selectedId]); // eslint-disable-line react-hooks/exhaustive-deps

	/* ---- render THREE objects only (no <Canvas> here) ---- */
	return (
		<>
			{/* Sun */}
			<group
				ref={sunRef}
				position={[0, 0, 0]}
				scale={[
					sun.visScale * SIZE_MULT,
					sun.visScale * SIZE_MULT,
					sun.visScale * SIZE_MULT,
				]}
			>
				<SelfRotate speed={0.08}>
					{ModelMap.sun ? (
						<ModelMap.sun />
					) : (
						<mesh>
							<sphereGeometry args={[1.2]} />
							<meshStandardMaterial color="#ffaa00" />
						</mesh>
					)}
				</SelfRotate>

				{/* fully invisible hitbox */}
				<mesh
					onPointerOver={(e) => {
						e.stopPropagation();
						setHovered("sun");
					}}
					onPointerOut={(e) => {
						e.stopPropagation();
						clearHovered();
					}}
					onClick={(e) => {
						e.stopPropagation();
						focusPlanet("sun");
					}}
				>
					<sphereGeometry args={[1.6, 16, 16]} />
					<meshBasicMaterial
						transparent
						opacity={0}
						depthWrite={false}
						colorWrite={false}
						toneMapped={false}
					/>
				</mesh>

				{hoveredId === "sun" && selectedId !== "sun" && (
					<Html
						transform
						distanceFactor={8}
						position={[0, sun.visScale * SIZE_MULT * 1.6, 0]}
						style={{
							padding: "6px 10px",
							background: "rgba(0,0,0,0.6)",
							border: "1px solid rgba(255,255,255,0.35)",
							borderRadius: 12,
							color: "#fff",
							fontSize: 12,
							pointerEvents: "none",
						}}
					>
						<b>{sun.name}</b>
					</Html>
				)}
			</group>

			{/* Planets */}
			{planets.map((p) => {
				const s = (p.visScale || 0.4) * SIZE_MULT;
				const M = ModelMap[p.id];
				if (!M) return null;
				const isHovered = hoveredId === p.id;
				const isSelected = selectedId === p.id;

				return (
					<group
						key={p.id}
						ref={(el) => (planetRefs.current[p.id] = el)}
						scale={[s, s, s]}
					>
						<SelfRotate speed={0.2}>
							<M />
						</SelfRotate>

						{/* fully invisible hitbox */}
						<mesh
							onPointerOver={(e) => {
								e.stopPropagation();
								setHovered(p.id);
							}}
							onPointerOut={(e) => {
								e.stopPropagation();
								clearHovered();
							}}
							onClick={(e) => {
								e.stopPropagation();
								focusPlanet(p.id);
							}}
						>
							<sphereGeometry args={[1.4, 16, 16]} />
							<meshBasicMaterial
								transparent
								opacity={0}
								depthWrite={false}
								colorWrite={false}
								toneMapped={false}
							/>
						</mesh>

						{isHovered && !isSelected && (
							<Html
								transform
								distanceFactor={8}
								position={[0, s * 1.6, 0]}
								style={{
									padding: "6px 10px",
									background: "rgba(0,0,0,0.6)",
									border: "1px solid rgba(255,255,255,0.35)",
									borderRadius: 12,
									color: "#fff",
									fontSize: 12,
									pointerEvents: "none",
								}}
							>
								<b>{p.name}</b>
							</Html>
						)}
					</group>
				);
			})}

			{/* Moon */}
			{moon && (
				<group
					ref={moonRef}
					scale={[
						moon.visScale * SIZE_MULT,
						moon.visScale * SIZE_MULT,
						moon.visScale * SIZE_MULT,
					]}
				>
					<SelfRotate speed={0.15}>
						{ModelMap.moon ? <ModelMap.moon /> : null}
					</SelfRotate>
				</group>
			)}

			{/* Dolly follows selection */}
			<Dolly />

			{/* Optional: invisible mega-sphere to clear selection on empty click */}
			<mesh
				onClick={() => {
					clearSelected();
					clearHovered();
				}}
				visible={false}
			>
				<sphereGeometry args={[100, 8, 8]} />
				<meshBasicMaterial transparent opacity={0} />
			</mesh>
		</>
	);
}
