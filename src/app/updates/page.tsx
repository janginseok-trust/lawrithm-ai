// /app/updates/page.tsx

export default function UpdatesPage() {
  return (
    <main style={{
      maxWidth: 720,
      margin: "0 auto",
      padding: "64px 16px 80px",
      color: "#fff",
      fontFamily: "'Noto Serif KR', serif"
    }}>
      <h1 style={{
        fontSize: 32,
        fontWeight: 900,
        marginBottom: 26,
        color: "#8ed6ff"
      }}>
        Update Status
      </h1>
      <section style={{
        background: "#232343",
        borderRadius: 18,
        padding: "28px 22px",
        fontSize: 17,
        boxShadow: "0 8px 32px rgba(100,200,255,0.07)",
        lineHeight: 1.7,
        marginBottom: 20
      }}>
        <div style={{ marginBottom: 22 }}>
          <b>Last Update:</b> <span style={{ color: "#8ed6ff" }}>June 1, 2025</span>
          <br />
          <b>Current Status:</b> Beta version (progressively updated) — only some materials are reflected; full DB expansion in progress.
          <br />
          <span style={{ color: "#9bd3ff" }}>
            Beta version: Database is being expanded; some materials may not be included yet.
          </span>
        </div>
        <div>
          <b>Notes</b>
          <ul style={{ margin: "12px 0 0 20px" }}>
            <li>
              Latest cases/statutes are auto-updated weekly/monthly from official DB.
            </li>
            <li>
              Some materials/countries/categories may not be included yet.
            </li>
            <li>
              For missing materials/requests, email us—updates within 48 hours:
              <a href="mailto:589second@gmail.com" style={{ color: "#90e0ff", marginLeft: 5 }}>
                589second@gmail.com
              </a>
            </li>
          </ul>
        </div>
      </section>
      <div style={{ color: "#8ed6ff", fontSize: 15, textAlign: "right", marginTop: 24 }}>
        Request/Contact: <a href="mailto:589second@gmail.com" style={{ color: "#90e0ff" }}>589second@gmail.com</a>
      </div>
    </main>
  );
}
