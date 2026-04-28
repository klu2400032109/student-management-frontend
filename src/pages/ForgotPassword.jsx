import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import AuthShell from "../components/AuthShell.jsx";

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [msg, setMsg] = useState("");

  const requestReset = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      const res = await api.post("/api/auth/forgot", { email });
      // Demo-friendly: backend returns a token so you can reset without email integration.
      const t = res.data?.token || "";
      if (!t) {
        setMsg(res.data?.message || "No account found with that email");
        return;
      }
      setToken(t);
      setStep(2);
    } catch (err) {
      setMsg(err?.response?.data?.message || "Could not start reset");
    }
  };

  const doReset = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      await api.post("/api/auth/reset", { token, newPassword });
      setStep(3);
    } catch (err) {
      setMsg(err?.response?.data?.message || "Reset failed");
    }
  };

  return (
    <AuthShell title="Student Project Hub" subtitle="Reset password">
      {step === 1 ? (
        <form onSubmit={requestReset} className="form">
          <div className="field">
            <label className="field-label">Registered email</label>
            <input className="input" placeholder="name@college.edu" value={email} onChange={(e) => setEmail(e.target.value)} />
            <div className="hint">For this demo project, we show a reset token (no email sending).</div>
          </div>
          {msg ? <div className="msg error">{msg}</div> : null}
          <button className="btn primary" type="submit">Generate reset token</button>
          <div className="auth-links">
            <Link to="/login">Back to login</Link>
          </div>
        </form>
      ) : null}

      {step === 2 ? (
        <form onSubmit={doReset} className="form">
          <div className="field">
            <label className="field-label">Reset token</label>
            <input className="input" value={token} onChange={(e) => setToken(e.target.value)} />
            <div className="hint">Copy this token and keep it safe. It expires soon.</div>
          </div>

          <div className="field">
            <label className="field-label">New password</label>
            <input className="input" type="password" placeholder="Enter a new password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          </div>

          {msg ? <div className="msg error">{msg}</div> : null}
          <button className="btn primary" type="submit">Reset password</button>
          <div className="auth-links">
            <Link to="/login">Back to login</Link>
          </div>
        </form>
      ) : null}

      {step === 3 ? (
        <div className="form">
          <div className="msg success">Password updated successfully ✅</div>
          <Link className="btn primary" to="/login">Go to login</Link>
          <div className="hint">If you are using a hosted demo, restart the backend if needed.</div>
        </div>
      ) : null}
    </AuthShell>
  );
}