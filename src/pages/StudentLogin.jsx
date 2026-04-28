import React, { useMemo, useState } from "react";
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

export default function StudentLogin() {
  const nav = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [captchaInput, setCaptchaInput] = useState("");
  const [captcha, setCaptcha] = useState(makeCaptcha());
  const [msg, setMsg] = useState("");

  const subtitle = useMemo(() => "Student login", []);

  const onChange = (k) => (e) => {
    setForm({ ...form, [k]: e.target.value });
  };

  const refreshCaptcha = () => {
    setCaptcha(makeCaptcha());
    setCaptchaInput("");
  };

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");

    if (captchaInput.trim() !== captcha) {
      setMsg("Captcha is incorrect");
      refreshCaptcha();
      return;
    }

    try {
      const res = await api.post("/api/auth/login", {
        ...form,
        role: "STUDENT",
      });

      setAuth(res.data.token, res.data.user);
      nav("/dashboard");
    } catch (err) {
      setMsg(err?.response?.data?.message || "Student login failed");
      refreshCaptcha();
    }
  };

  return (
    <AuthShell title="Student Project Hub" subtitle={subtitle}>
      <form onSubmit={submit} className="form">
        <div className="field">
          <label className="field-label">Email</label>
          <input
            className="input"
            type="email"
            placeholder="student@gmail.com"
            value={form.email}
            onChange={onChange("email")}
            required
          />
        </div>

        <div className="field">
          <div className="field-row">
            <label className="field-label">Password</label>
            <Link to="/forgot-password" className="link">Forgot password?</Link>
          </div>
          <input
            className="input"
            type="password"
            placeholder="Enter password"
            value={form.password}
            onChange={onChange("password")}
            required
          />
        </div>

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
            type="text"
            placeholder="Enter captcha"
            value={captchaInput}
            onChange={(e) => setCaptchaInput(e.target.value.toUpperCase())}
            required
          />
        </div>

        {msg && <div className="msg error">{msg}</div>}

        <button type="submit" className="btn primary">Student Login</button>

        <div className="auth-links">
          Don&apos;t have an account? <Link to="/register">Register</Link>
        </div>

        <div className="auth-links">
          Are you admin? <Link to="/admin-login">Admin Login</Link>
        </div>
      </form>
    </AuthShell>
  );
}