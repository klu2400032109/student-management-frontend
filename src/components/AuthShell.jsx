import React from "react";

/**
 * Reusable auth page shell (left marketing panel + right form card).
 */
export default function AuthShell({ title = "Student Project Hub", subtitle, children }) {
  return (
    <div className="auth-bg">
      <div className="auth-shell">
        <aside className="auth-side" aria-hidden>
          <div className="auth-side-inner">
            <div className="auth-mark">
              <div className="auth-mark-logo">SP</div>
              <div>
                <div className="auth-mark-title">{title}</div>
                <div className="auth-mark-sub">Projects • Portfolio • Reviews</div>
              </div>
            </div>

            <h1 className="auth-hero">
              Turn your college projects into a portfolio reviewers will remember.
            </h1>
            <ul className="auth-bullets">
              <li>Submit projects with links, files, and status tracking</li>
              <li>Auto-ready portfolio page for sharing</li>
              <li>Admin review & feedback panel</li>
            </ul>

            <div className="auth-side-note">
              Tip: Add real GitHub + Live URL links for higher review scores.
            </div>
          </div>
        </aside>

        <section className="auth-card" role="region" aria-label="Authentication">
          <div className="auth-card-head">
            <div className="auth-title">{title}</div>
            {subtitle ? <div className="auth-subtitle">{subtitle}</div> : null}
          </div>
          {children}
        </section>
      </div>
    </div>
  );
}