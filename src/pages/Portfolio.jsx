import React, { useEffect, useState } from "react";
import api from "../api";

export default function Portfolio() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/api/projects");
      setProjects(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Portfolio load error:", err);
      setError("Failed to load portfolio");
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Portfolio</h1>
        <p>View all your uploaded academic projects and portfolio details.</p>
      </div>

      {loading && <p>Loading portfolio...</p>}
      {error && <p className="error-text">{error}</p>}

      {!loading && projects.length === 0 && (
        <div className="empty-card">
          <h3>No portfolio projects found</h3>
          <p>Add some projects first to display them here.</p>
        </div>
      )}

      {!loading && projects.length > 0 && (
        <div className="portfolio-grid">
          {projects.map((project) => (
            <div className="portfolio-card" key={project.id}>
              <h3>{project.title || "Untitled Project"}</h3>
              <p><strong>Status:</strong> {project.status || "N/A"}</p>
              <p><strong>Tech Stack:</strong> {project.techStack || "N/A"}</p>
              <p><strong>Description:</strong> {project.description || "No description"}</p>

              {project.githubUrl && (
                <p>
                  <strong>GitHub:</strong>{" "}
                  <a href={project.githubUrl} target="_blank" rel="noreferrer">
                    Open Link
                  </a>
                </p>
              )}

              {project.demoUrl && (
                <p>
                  <strong>Demo:</strong>{" "}
                  <a href={project.demoUrl} target="_blank" rel="noreferrer">
                    View Demo
                  </a>
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}