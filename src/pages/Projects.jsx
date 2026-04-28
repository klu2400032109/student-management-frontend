import React, { useEffect, useMemo, useState } from "react";
import api from "../api";
import "./Projects.css";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    status: "Pending",
    techStack: "",
    githubUrl: "",
    demoUrl: "",
    mediaUrl: ""
  });

  const loadProjects = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/projects");
      setProjects(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error loading projects:", error);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch =
        (project.title || "").toLowerCase().includes(search.toLowerCase()) ||
        (project.description || "").toLowerCase().includes(search.toLowerCase()) ||
        (project.techStack || "").toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" || project.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [projects, search, statusFilter]);

  const startEdit = (project) => {
    setEditingId(project.id);
    setEditForm({
      title: project.title || "",
      description: project.description || "",
      status: project.status || "Pending",
      techStack: project.techStack || "",
      githubUrl: project.githubUrl || "",
      demoUrl: project.demoUrl || "",
      mediaUrl: project.mediaUrl || ""
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({
      title: "",
      description: "",
      status: "Pending",
      techStack: "",
      githubUrl: "",
      demoUrl: "",
      mediaUrl: ""
    });
  };

  const saveEdit = async (id) => {
    try {
      await api.put(`/api/projects/${id}`, editForm);
      alert("Project updated successfully");
      setEditingId(null);
      loadProjects();
    } catch (error) {
      console.error("Error updating project:", error);
      alert("Failed to update project");
    }
  };

  const deleteProject = async (id) => {
    const ok = window.confirm("Are you sure you want to delete this project?");
    if (!ok) return;

    try {
      await api.delete(`/api/projects/${id}`);
      alert("Project deleted successfully");
      loadProjects();
    } catch (error) {
      console.error("Error deleting project:", error);
      alert("Failed to delete project");
    }
  };

  const formatDate = (dateValue) => {
    if (!dateValue) return "No date";

    const date = new Date(dateValue);
    if (isNaN(date.getTime())) return "No date";

    return date.toLocaleString();
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Completed":
        return "status-badge completed";
      case "In Progress":
        return "status-badge inprogress";
      case "Pending":
        return "status-badge pending";
      case "Rejected":
        return "status-badge rejected";
      default:
        return "status-badge";
    }
  };

  return (
    <div className="projects-page">
      <h1 className="page-title">Projects</h1>

      <div className="project-controls">
        <input
          type="text"
          placeholder="Search by title, description, or tech..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-box"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="filter-select"
        >
          <option value="All">All</option>
          <option value="Completed">Completed</option>
          <option value="In Progress">In Progress</option>
          <option value="Pending">Pending</option>
          <option value="Rejected">Rejected</option>
        </select>

        <button onClick={loadProjects} className="refresh-btn">
          Refresh
        </button>
      </div>

      <div className="table-wrapper">
        <table className="projects-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Tech</th>
              <th>Description</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6">Loading projects...</td>
              </tr>
            ) : filteredProjects.length === 0 ? (
              <tr>
                <td colSpan="6">No projects found.</td>
              </tr>
            ) : (
              filteredProjects.map((project) => (
                <tr key={project.id}>
                  {editingId === project.id ? (
                    <>
                      <td>
                        <input
                          type="text"
                          value={editForm.title}
                          onChange={(e) =>
                            setEditForm({ ...editForm, title: e.target.value })
                          }
                        />
                      </td>

                      <td>
                        <select
                          value={editForm.status}
                          onChange={(e) =>
                            setEditForm({ ...editForm, status: e.target.value })
                          }
                        >
                          <option value="Completed">Completed</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Pending">Pending</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </td>

                      <td>
                        <input
                          type="text"
                          value={editForm.techStack}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              techStack: e.target.value
                            })
                          }
                        />
                      </td>

                      <td>
                        <input
                          type="text"
                          value={editForm.description}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              description: e.target.value
                            })
                          }
                        />
                      </td>

                      <td>-</td>

                      <td>
                        <div className="action-buttons">
                          <button
                            className="save-btn"
                            onClick={() => saveEdit(project.id)}
                          >
                            Save
                          </button>
                          <button
                            className="cancel-btn"
                            onClick={cancelEdit}
                          >
                            Cancel
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>
                        <div className="project-title-cell">
                          <strong>{project.title}</strong>
                        </div>
                      </td>

                      <td>
                        <span className={getStatusClass(project.status)}>
                          {project.status || "N/A"}
                        </span>
                      </td>

                      <td>{project.techStack || "N/A"}</td>

                      <td>{project.description || "N/A"}</td>

                      <td>{formatDate(project.createdAt)}</td>

                      <td>
                        <div className="action-buttons">
                          <button
                            className="edit-btn"
                            onClick={() => startEdit(project)}
                          >
                            Edit
                          </button>
                          <button
                            className="delete-btn"
                            onClick={() => deleteProject(project.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}