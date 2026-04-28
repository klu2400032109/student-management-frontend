import React from "react";
import { Link } from "react-router-dom";

// ✅ correct paths
import Portfolio from "./Portfolio.jsx";
import Admin from "./Admin.jsx";
import { isAuthed, getUser } from "../auth";

export default function AdminPage() {
  const user = getUser();

  if (!isAuthed()) {
    return <div>Please login</div>;
  }

  return (
    <div>
      <h1>Admin Dashboard</h1>

      <p>Welcome {user?.name}</p>

      <div style={{ marginTop: "20px" }}>
        <Link to="/projects">View Projects</Link>
      </div>

      <div>
        <Link to="/portfolio">View Portfolio</Link>
      </div>
    </div>
  );
}