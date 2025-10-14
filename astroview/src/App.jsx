import SolarScene from "./components/SolarScene.jsx";
import InfoPanel from "./components/InfoPanel.jsx";
import { PlanetProvider } from "./context/PlanetContext.jsx";

function App() {
	return (
		<PlanetProvider>
			<div className="app">
				<SolarScene />
				<InfoPanel />
			</div>
		</PlanetProvider>
	);
}

export default App;
