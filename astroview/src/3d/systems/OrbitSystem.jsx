import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

export default function OrbitSystem({ children, speed = 1, radius = 1 }) {
  const angle = useRef(0);
  const group = useRef();

  useFrame((_, dt) => {
    angle.current += dt * speed;
    if (group.current) {
      group.current.position.x = Math.cos(angle.current) * radius;
      group.current.position.z = Math.sin(angle.current) * radius;
      group.current.rotation.y += dt * speed * 0.3;
    }
  });

  return <group ref={group}>{children}</group>;
}
