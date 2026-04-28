import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import AuthShell from "../components/AuthShell.jsx";

export default function Register() {
  const nav = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", department: "", year: "" });
  const [msg, setMsg] = useState("");

  const onChange = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      await api.post("/api/auth/register", form);
      nav("/login");
    } catch (err) {
      setMsg(err?.response?.data?.message || "Register failed");
    }
  };

  return (
    <AuthShell title="Student Project Hub" subtitle="Create your account">
      <form onSubmit={submit} className="form">
        <div className="field">
          <label className="field-label">Full name</label>
          <input className="input" placeholder="Your name" value={form.name} onChange={onChange("name")} />
        </div>

        <div className="field">
          <label className="field-label">Email</label>
          <input className="input" placeholder="name@college.edu" value={form.email} onChange={onChange("email")} />
        </div>

        <div className="field">
          <label className="field-label">Password</label>
          <input className="input" placeholder="Create a strong password" type="password" value={form.password} onChange={onChange("password")} />
          <div className="hint">Use 8+ characters with a number for best results.</div>
        </div>

        <div className="grid2">
          <div className="field">
            <label className="field-label">Department</label>
            <input className="input" placeholder="CSE / ECE / ..." value={form.department} onChange={onChange("department")} />
          </div>
          <div className="field">
            <label className="field-label">Year</label>
            <input className="input" placeholder="2nd / 3rd / 4th" value={form.year} onChange={onChange("year")} />
          </div>
        </div>

        {msg ? <div className="msg error">{msg}</div> : null}
        <button className="btn primary" type="submit">Create Account</button>

        <div className="auth-links">
          <span>Already have an account?</span> <Link to="/login">Login</Link>
        </div>
      </form>
    </AuthShell>
  );
}