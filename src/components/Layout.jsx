import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { getUser, logout } from "../auth";

export default function Layout() {
  const nav = useNavigate();
  const user = getUser();

  const handleLogout = () => {
    logout();
    nav("/login");
  };

  const navClass = ({ isActive }) =>
    isActive ? "navitem active-nav" : "navitem";

  return (
    <div className="page">
      <div className="topbar">
        <div className="brand">
          <div className="logo">SP</div>
          <div>
            <div className="title">Student Project Hub</div>
            <div className="subtitle">
              {user?.role === "ADMIN" ? "Admin Panel" : "Student Portal"}
            </div>
          </div>
        </div>

        <div className="topbar-right">
          <div className="userchip">{user?.name || user?.email || "User"}</div>
          <button className="btn danger" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <div className="shell">
        <aside className="sidebar">
          {user?.role === "ADMIN" ? (
            <NavLink to="/admin" className={navClass}>
              Admin Dashboard
            </NavLink>
          ) : (
            <>
              <NavLink to="/dashboard" className={navClass}>
                Dashboard
              </NavLink>

              <NavLink to="/projects" className={navClass}>
                Projects
              </NavLink>

              <NavLink to="/projects/new" className={navClass}>
                Add Project
              </NavLink>

              <NavLink to="/portfolio" className={navClass}>
                Portfolio
              </NavLink>
            </>
          )}
        </aside>

        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}