import data from "../data/planets.json";
import { usePlanet } from "../context/PlanetContext.jsx";

export default function InfoPanel() {
	const { selectedId, clearSelected } = usePlanet();
	const item = data.find((p) => p.id === activeId);

	return (
		<aside className={`panel ${item ? "open" : ""}`} aria-hidden="{!item}">
			<div
				className="card"
				role="dialog"
				aria-modal="true"
				aria-labelledby="panel-title"
			>
				<button className="close" onClick={clearSelected} aria-label="Close">
					✕
				</button>

				{item && (
					<>
						<header className="card-header">
							<h1 id="panel-title" className="title">
								{item.name}
							</h1>
							<p className="desc">{item.secondName}</p>
						</header>

						<p className="desc">{item.description}</p>

						<section className="facts" aria-label="Planet facts">
							{Object.entries(item.facts).map(([k, v]) => (
								<div key={k} className="fact">
									<span className="k">{labelize(k)}</span>
									<span className="v">{v}</span>
								</div>
							))}
						</section>
					</>
				)}
			</div>
		</aside>
	);
}

function labelize(key) {
	return key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());
}
