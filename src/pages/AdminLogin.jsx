import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import AuthShell from "../components/AuthShell.jsx";
import { setAuth } from "../auth";

function makeCaptcha() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let text = "";
  for (let i = 0; i < 5; i++) {
    text += chars[Math.floor(Math.random() * chars.length)];
  }
  return text;
}

export default function AdminLogin() {
  const nav = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [captcha, setCaptcha] = useState(makeCaptcha());
  const [captchaInput, setCaptchaInput] = useState("");
  const [msg, setMsg] = useState("");

  const onChange = (key) => (e) => {
    setForm({ ...form, [key]: e.target.value });
  };

  const refreshCaptcha = () => {
    setCaptcha(makeCaptcha());
    setCaptchaInput("");
  };

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");

    if (captchaInput.trim().toUpperCase() !== captcha) {
      setMsg("Captcha is incorrect");
      refreshCaptcha();
      return;
    }

    try {
      const res = await api.post("/api/auth/login", {
        ...form,
        role: "ADMIN",
      });

      setAuth(res.data.token, res.data.user);
      nav("/admin");
    } catch (err) {
      setMsg(err?.response?.data?.message || "Admin login failed");
      refreshCaptcha();
    }
  };

  return (
    <AuthShell title="Student Project Hub" subtitle="Admin Login">
      <form onSubmit={submit} className="form">
        <div className="field">
          <label className="field-label">Admin Email</label>
          <input
            className="input"
            type="email"
            placeholder="admin@gmail.com"
            value={form.email}
            onChange={onChange("email")}
            required
          />
        </div>

        <div className="field">
          <label className="field-label">Password</label>
          <input
            className="input"
            type="password"
            placeholder="Enter password"
            value={form.password}
            onChange={onChange("password")}
            required
          />
        </div>

        {/* CAPTCHA */}
        <div className="field">
          <label className="field-label">Captcha</label>

          <div className="captcha-box">
            <span className="captcha-text">{captcha}</span>

            <button
              type="button"
              className="btn ghost"
              onClick={refreshCaptcha}
            >
              Refresh
            </button>
          </div>

          <input
            className="input"
            placeholder="Enter captcha"
            value={captchaInput}
            onChange={(e) =>
              setCaptchaInput(e.target.value.toUpperCase())
            }
            required
          />
        </div>

        {msg && <div className="msg error">{msg}</div>}

        <button type="submit" className="btn primary">
          Admin Login
        </button>

        <div className="login-switch">
          Are you student? <Link to="/login">Student Login</Link>
        </div>
      </form>
    </AuthShell>
  );
}