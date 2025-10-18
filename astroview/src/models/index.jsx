// Default imports (gltfjsx usually exports default)
import Sun from "./Sun.jsx";
import Mercury from "./Mercure.jsx";
import Venus from "./Venus.jsx";
import Earth from "./Earth.jsx";
import Mars from "./Mars.jsx";
import Jupiter from "./Jupiter.jsx";
import Saturn from "./Saturne.jsx";
import Uranus from "./Uranus.jsx";
import Neptune from "./Neptune.jsx";

// Map of ids -> components (ids should match your planets.json)
export const ModelMap = {
	sun: Sun, //✅
	mercury: Mercury, //✅
	venus: Venus, //✅
	earth: Earth, //✅
	mars: Mars, //✅
	jupiter: Jupiter, //✅
	saturn: Saturn, //✅
	uranus: Uranus, //✅
	neptune: Neptune, //✅
};
