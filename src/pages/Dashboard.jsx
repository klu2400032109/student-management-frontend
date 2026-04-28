import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/projects");
      const data = Array.isArray(response.data) ? response.data : [];
      setProjects(data);
    } catch (error) {
      console.error("Error fetching projects:", error);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const stats = useMemo(() => {
    const total = projects.length;

    const completed = projects.filter(
      (p) => (p.status || "").trim().toLowerCase() === "completed"
    ).length;

    const inProgress = projects.filter((p) => {
      const status = (p.status || "").trim().toLowerCase();
      return status === "in progress" || status === "inprogress";
    }).length;

    const pending = projects.filter(
      (p) => (p.status || "").trim().toLowerCase() === "pending"
    ).length;

    const rejected = projects.filter(
      (p) => (p.status || "").trim().toLowerCase() === "rejected"
    ).length;

    return { total, completed, inProgress, pending, rejected };
  }, [projects]);

  return (
    <div className="dashboard-page">
      <h1 className="dashboard-title">Dashboard</h1>
      <p className="dashboard-subtitle">
        Welcome back! Here is your project summary.
      </p>

      {loading ? (
        <div className="dashboard-loading">Loading dashboard...</div>
      ) : (
        <>
          <div className="dashboard-cards">
            <div className="dashboard-card">
              <h3>Total Projects</h3>
              <p>{stats.total}</p>
            </div>

            <div className="dashboard-card">
              <h3>Completed</h3>
              <p>{stats.completed}</p>
            </div>

            <div className="dashboard-card">
              <h3>In Progress</h3>
              <p>{stats.inProgress}</p>
            </div>

            <div className="dashboard-card">
              <h3>Pending</h3>
              <p>{stats.pending}</p>
            </div>

            <div className="dashboard-card">
              <h3>Rejected</h3>
              <p>{stats.rejected}</p>
            </div>
          </div>

          <div className="dashboard-section">
            <h2 className="dashboard-section-title">Quick Actions</h2>

            <div className="dashboard-actions">
              <Link to="/projects" className="dashboard-btn">
                View Projects
              </Link>

              <Link to="/projects/new" className="dashboard-btn">
                Add Project
              </Link>

              <Link to="/portfolio" className="dashboard-btn">
                Open Portfolio
              </Link>
            </div>
          </div>

          <div className="dashboard-section">
            <h2 className="dashboard-section-title">Recent Projects</h2>

            <div className="dashboard-table-card">
              {projects.length === 0 ? (
                <p className="dashboard-empty">No projects found</p>
              ) : (
                <table className="dashboard-table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Status</th>
                      <th>Tech Stack</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.slice(0, 5).map((project) => (
                      <tr key={project.id}>
                        <td>{project.title || "N/A"}</td>
                        <td>{project.status || "N/A"}</td>
                        <td>{project.techStack || "N/A"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}