export default function AboutPage() {
  return (
    <div
      style={{
        padding: 40,
        maxWidth: 800,
        margin: "0 auto",
        color: "#fff",
        fontFamily: "'Noto Serif KR', serif",
        backgroundColor: "#222236",
        borderRadius: 18,
        boxShadow: "0 12px 36px rgba(142,214,255,0.15)",
        lineHeight: 1.7,
      }}
    >
      <h1 style={{ fontSize: 36, fontWeight: 900, marginBottom: 32, color: "#8ed6ff" }}>
        About Lawrithm
      </h1>
      <p style={{ fontSize: 18, marginBottom: 20 }}>
        Lawrithm is an AI-powered legal automation service that analyzes a wide range of legal case statements, 
        including family, civil, and criminal matters. Our technology automatically generates reliable legal reports 
        by incorporating up-to-date statutes, case law, and relevant legal issues in a structured and trustworthy format.
      </p>
      <ul
        style={{
          fontSize: 17,
          marginLeft: 20,
          marginBottom: 30,
          color: "#c5d0ff",
          listStyleType: "disc",
        }}
      >
        <li>✔︎ Always up-to-date: Real-time updates of statutes and court decisions</li>
        <li>✔︎ Strict privacy: No personal data is stored, all analysis is fully anonymous</li>
        <li>✔︎ For everyone: Designed for lawyers, students, legal professionals, and the public</li>
        <li>✔︎ User-friendly: Create trusted AI-powered legal reports in less than 1 minute</li>
      </ul>
      <p style={{ fontSize: 16, color: "#8ed6ff", fontWeight: "600" }}>
        If you have any questions or feedback, feel free to contact our customer support at any time.
      </p>
    </div>
  );
}
