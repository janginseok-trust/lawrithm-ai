export default function FaqPage() {
  return (
    <main style={{
      maxWidth: 780,
      margin: "0 auto",
      padding: "64px 16px 80px",
      color: "#fff",
      fontFamily: "'Noto Serif KR', serif"
    }}>
      <h1 style={{
        fontSize: 34,
        fontWeight: 900,
        marginBottom: 28,
        color: "#8ed6ff"
      }}>
        Frequently Asked Questions
      </h1>

      <section style={{
        background: "#232343",
        borderRadius: 18,
        padding: "34px 26px",
        fontSize: 17,
        boxShadow: "0 8px 32px rgba(100,200,255,0.07)",
        lineHeight: 1.75,
        marginBottom: 28
      }}>
        <div style={{ marginBottom: 34 }}>
          <b>Q. How is this service different from ChatGPT or search engines?</b>
          <br />
          <span style={{ color: "#9bd3ff" }}>
            A. ChatGPT’s data is current only up to October 2023 and may miss recent cases or amendments.
            Our service only uses the latest data directly crawled from official court/government databases, and every document includes verified source/date/case info for safe use in real-world tasks.
          </span>
        </div>
        <div style={{ marginBottom: 34 }}>
          <b>Q. Is this service legal? Is there any issue with the Attorney-at-Law Act?</b>
          <br />
          <span style={{ color: "#9bd3ff" }}>
            A. We do NOT provide legal advice, interpretation, or representation—only automatic collection, summary, and download from official databases. All operations strictly comply with current laws and attorney regulations.
          </span>
        </div>
        <div style={{ marginBottom: 34 }}>
          <b>Q. Are the latest cases and statutes always included?</b>
          <br />
          <span style={{ color: "#9bd3ff" }}>
            A. All data is updated regularly from official sites. If anything is missing, email us and we will add it within 48 hours.
          </span>
        </div>
        <div style={{ marginBottom: 34 }}>
          <b>Q. Where can I use these reports?</b>
          <br />
          <span style={{ color: "#9bd3ff" }}>
            A. Reports are optimized for law school/homework, exam prep, research, or practice use. For formal submissions, please cross-check with original sources.
          </span>
        </div>
        <div style={{ marginBottom: 34 }}>
          <b>Q. Do you store my personal info or uploaded files?</b>
          <br />
          <span style={{ color: "#9bd3ff" }}>
            A. No personal info or uploaded files are stored. Only minimal info needed for service is encrypted and processed.
          </span>
        </div>
        <div style={{ marginBottom: 34 }}>
          <b>Q. Is there a free trial? Can I get a refund?</b>
          <br />
          <span style={{ color: "#9bd3ff" }}>
            A. Refunds are not available after download (digital goods), but valid errors or unused services will be refunded. Free trials are available for new users.
          </span>
        </div>
        <div>
          <b>Q. How is this different from asking a professor or lawyer?</b>
          <br />
          <span style={{ color: "#9bd3ff" }}>
            A. For legal advice and judgment, professionals are best. Our tool specializes in repetitive data collection and summary to save time and cost before consulting an expert.
          </span>
        </div>
      </section>
      <div style={{ color: "#8ed6ff", fontSize: 15, textAlign: "right", marginTop: 28 }}>
        Contact: <a href="mailto:589second@gmail.com" style={{ color: "#90e0ff" }}>589second@gmail.com</a>
      </div>
    </main>
  );
}
