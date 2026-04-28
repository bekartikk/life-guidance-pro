import { useEffect, useMemo, useState } from "react";

function parseProjectMap(source) {
  const lines = String(source || "").split(/\r?\n/);
  const sections = [];
  let current = null;

  for (const line of lines) {
    if (line.startsWith("## ")) {
      if (current) sections.push(current);
      current = { heading: line.replace(/^## /, "").trim(), content: [] };
      continue;
    }
    if (current) current.content.push(line);
  }

  if (current) sections.push(current);
  return sections;
}

function ProjectMapTab() {
  const [mapText, setMapText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadMap() {
      setIsLoading(true);
      setError("");
      try {
        const response = await fetch("/PROJECT_BRAIN_MAP.md", { cache: "no-store" });
        if (!response.ok) {
          throw new Error("Could not load the current project map.");
        }
        const text = await response.text();
        if (!ignore) setMapText(text);
      } catch (mapError) {
        if (!ignore) setError(mapError.message || "Could not load the project map.");
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }

    loadMap();
    return () => { ignore = true; };
  }, []);

  const sections = useMemo(() => parseProjectMap(mapText), [mapText]);

  return (
    <section className="project-map-panel">
      <div className="form-header">
        <div>
          <p className="eyebrow">System Overview</p>
          <h2>Project brain map</h2>
          <p className="muted-text">
            This view is generated from the codebase so you have one place to understand the project without re-uploading files.
          </p>
        </div>
      </div>

      {isLoading && <section className="section-loading-card">Loading the latest project map...</section>}
      {error && <p className="error-message">{error}</p>}

      {!isLoading && !error && (
        <>
          <div className="project-map-summary">
            <div>
              <span>Sections</span>
              <strong>{sections.length}</strong>
            </div>
            <div>
              <span>Auto-updates</span>
              <strong>On dev and build</strong>
            </div>
            <div>
              <span>Best use</span>
              <strong>Share this file first</strong>
            </div>
          </div>

          <div className="project-map-sections">
            {sections.map((section) => (
              <article className="project-map-card" key={section.heading}>
                <h3>{section.heading}</h3>
                <pre>{section.content.join("\n").trim()}</pre>
              </article>
            ))}
          </div>
        </>
      )}
    </section>
  );
}

export default ProjectMapTab;
