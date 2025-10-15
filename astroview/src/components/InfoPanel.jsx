import data from "../data/planets.json";
import { usePlanet } from "../context/PlanetContext.jsx";

export default function InfoPanel() {
  const { selectedId, hoverId, clearSelected } = usePlanet();
  const activeId = selectedId ?? hoverId;
  const item = data.find((p) => p.id === activeId);

  return (
    <aside className="panel" role="complementary" aria-live="polite">
      {item ? (
        <>
          <header>
            <h2 style={{ margin: "0 0 4px" }}>{item.name}</h2>
            {item.secondName && (
              <p style={{ opacity: 0.8, margin: 0 }}>{item.secondName}</p>
            )}
          </header>

          <section style={{ marginTop: 12 }}>
            <pre style={{ whiteSpace: "pre-wrap", margin: 0 }}>
{JSON.stringify(item.facts, null, 2)}
            </pre>
          </section>

          <div style={{ marginTop: 12 }}>
            <button onClick={clearSelected}>Close</button>
          </div>
        </>
      ) : (
        <p>Hover of klik op een planeet…</p>
      )}
    </aside>
  );
}
