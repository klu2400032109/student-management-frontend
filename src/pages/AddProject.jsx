import React, { useState } from "react";
import api from "../api";

export default function AddProject() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    technologies: "",
    status: "Pending",
    githubUrl: "",
    liveUrl: "",
  });

  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const onChange = (key) => (e) => {
    setForm({ ...form, [key]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);

    try {
      await api.post("/api/projects", form);
      setMsg("✅ Project added successfully");

      setForm({
        title: "",
        description: "",
        technologies: "",
        status: "Pending",
        githubUrl: "",
        liveUrl: "",
      });
    } catch (err) {
      setMsg("❌ Failed to add project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="addproject-page">
      <h1 className="addproject-title">Add New Project</h1>

      <div className="addproject-card">
        <form onSubmit={submit} className="addproject-form">
          
          {/* TITLE */}
          <div className="form-group">
            <label>Project Title</label>
            <input
              type="text"
              placeholder="Enter project title"
              value={form.title}
              onChange={onChange("title")}
              required
            />
          </div>

          {/* DESCRIPTION */}
          <div className="form-group">
            <label>Description</label>
            <textarea
              rows="4"
              placeholder="Enter project description"
              value={form.description}
              onChange={onChange("description")}
              required
            />
          </div>

          {/* TECH + STATUS */}
          <div className="form-row">
            <div className="form-group">
              <label>Technologies</label>
              <input
                type="text"
                placeholder="React, Spring Boot, MySQL"
                value={form.technologies}
                onChange={onChange("technologies")}
              />
            </div>

            <div className="form-group">
              <label>Status</label>
              <select value={form.status} onChange={onChange("status")}>
                <option value="Pending">Pending</option>
                <option value="InProgress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          {/* LINKS */}
          <div className="form-group">
            <label>GitHub URL</label>
            <input
              type="url"
              placeholder="https://github.com/..."
              value={form.githubUrl}
              onChange={onChange("githubUrl")}
            />
          </div>

          <div className="form-group">
            <label>Live URL</label>
            <input
              type="url"
              placeholder="https://yourproject.netlify.app"
              value={form.liveUrl}
              onChange={onChange("liveUrl")}
            />
          </div>

          {/* MESSAGE */}
          {msg && (
            <div className={`alert ${msg.includes("successfully") ? "success" : "error"}`}>
              {msg}
            </div>
          )}

          {/* BUTTON */}
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Saving..." : "Save Project"}
          </button>
        </form>
      </div>
    </div>
  );
}