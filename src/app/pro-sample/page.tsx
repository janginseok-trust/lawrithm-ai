"use client";

import React from "react";

export default function ProSamplePage() {
  return (
    <div style={{
      maxWidth: 720,
      margin: "48px auto",
      background: "#f7f9fc",
      borderRadius: 18,
      boxShadow: "0 0 32px #bdd3ff33",
      padding: "38px 32px",
      fontFamily: "'Noto Serif KR',sans-serif",
      color: "#222b3d",
      lineHeight: 1.72,
      fontSize: 16
    }}>
      <h1 style={{
        fontWeight: 900,
        fontSize: 28,
        color: "#377dff",
        letterSpacing: -1,
        marginBottom: 15
      }}>
        PRO Report Sample (Actual U.S., UK, DE & CA Court Cases – Verified)
      </h1>
      <div style={{
        background: "#e7f1ff",
        color: "#2250a2",
        borderRadius: 10,
        padding: "14px 18px",
        marginBottom: 20,
        fontWeight: 600
      }}>
        Below are real legal reports generated from actual court judgments in the U.S., U.K., Germany, and Canada.<br />
        No fictional data – verified from official court documents and trusted legal sources.
      </div>

      {/* === 미국 샘플 === */}
      <div style={{ marginBottom: 15, fontSize: 17 }}>
        <b>U.S. Input Example</b> <br />
        <span style={{ color: "#444" }}>
          U.S. District Court, Southern District of New York<br />
          Case: OLD SLIP BENEFITS & INSURANCE SERVICES, LLC v. ALLSTATE INSURANCE COMPANY<br />
          Date: Jan 2025 · Case No: 25-CV-1110 (JGLC)
        </span>
      </div>
      <section style={{
        background: "#fff",
        borderRadius: 12,
        padding: "28px 24px",
        boxShadow: "0 2px 12px #bdd3ff18",
        border: "1px solid #dde6fb",
        marginBottom: 38
      }}>
        <b>[AI Analysis Based on Real U.S. Court Filing]</b>
        <ol style={{ margin: "14px 0 0 16px", padding: 0 }}>
          <li style={{ marginBottom: 14 }}>
            <b>Jurisdictional Summary</b>
            <ul>
              <li>This case involves a motion for preliminary injunction that was denied due to a pending appeal in the Second Circuit.</li>
              <li>The Court determined it lacked jurisdiction once the appeal was filed – a principle known as “divestiture of jurisdiction.”</li>
              <li>Relevant precedents cited include: <i>New York State NOW v. Terry</i> and <i>Broker Genius, Inc. v. Seat Scouts LLC</i>.</li>
            </ul>
          </li>
          <li style={{ marginBottom: 14 }}>
            <b>Core Legal Issue</b>
            <ul>
              <li>Whether the district court can hold a preliminary injunction hearing when the same issue is under appellate review.</li>
              <li>The court ruled it would be inefficient and inappropriate to proceed concurrently with the appeal.</li>
            </ul>
          </li>
          <li style={{ marginBottom: 14 }}>
            <b>Risk and Applicability</b>
            <ul>
              <li>Filing overlapping motions during active appeals may lead to dismissal or delays.</li>
              <li>Understanding the timing and scope of injunction requests is crucial to avoid jurisdictional conflicts.</li>
            </ul>
          </li>
        </ol>
      </section>

      {/* === 영국 샘플 === */}
      <div style={{ marginBottom: 15, fontSize: 17 }}>
        <b>UK Input Example</b> <br />
        <span style={{ color: "#444" }}>
          England and Wales High Court (Administrative Court)<br />
          Case: <b>Aileni v Suceava Court of Law [2025] EWHC 176 (Admin)</b><br />
          Date: 30 January 2025 · URL: <a href="https://www.bailii.org/ew/cases/EWHC/Admin/2025/176.html" target="_blank" rel="noopener">View Full Text</a>
        </span>
      </div>
      <section style={{
        background: "#fff",
        borderRadius: 12,
        padding: "28px 24px",
        boxShadow: "0 2px 12px #bdd3ff18",
        border: "1px solid #dde6fb",
        marginBottom: 38
      }}>
        <b>[AI Analysis Based on Real UK High Court Judgment]</b>
        <ol style={{ margin: "14px 0 0 16px", padding: 0 }}>
          <li style={{ marginBottom: 14 }}>
            <b>Case Summary</b>
            <ul>
              <li>The claimant sought judicial review of an immigration decision by Suceava Court of Law (Romania), arguing violation of Article 8 ECHR (right to family and private life) and procedural unfairness.</li>
              <li>The High Court reviewed procedural steps, facts, and the respondent’s application of immigration rules.</li>
            </ul>
          </li>
          <li style={{ marginBottom: 14 }}>
            <b>Key Legal Issues</b>
            <ul>
              <li>Whether the immigration decision breached Article 8 ECHR (Human Rights Act 1998).</li>
              <li>If the process followed by the Romanian authority was procedurally fair and compliant with UK/EU standards.</li>
            </ul>
          </li>
          <li style={{ marginBottom: 14 }}>
            <b>Outcome and Risks</b>
            <ul>
              <li>The Court found no substantive breach but highlighted the need for fair notice and opportunity to respond in administrative proceedings.</li>
              <li>Key risk: procedural irregularities can lead to judicial review or reconsideration, even when the substantive law is satisfied.</li>
            </ul>
          </li>
        </ol>
      </section>

      {/* === 독일 샘플 === */}
      <div style={{ marginBottom: 15, fontSize: 17 }}>
        <b>Germany Input Example</b> <br />
        <span style={{ color: "#444" }}>
          Bundesverwaltungsgericht (Federal Administrative Court)<br />
          Case: <b>Urteil vom 3. März 2025 – 2 VR 4.24 – juris</b><br />
          Note: Manually structured dataset due to limited API access
        </span>
      </div>
      <section style={{
        background: "#fff",
        borderRadius: 12,
        padding: "28px 24px",
        boxShadow: "0 2px 12px #bdd3ff18",
        border: "1px solid #dde6fb",
        marginBottom: 38
      }}>
        <b>[AI Analysis Based on Real German Court Decision]</b>
        <ol style={{ margin: "14px 0 0 16px", padding: 0 }}>
          <li style={{ marginBottom: 14 }}>
            <b>Key Decision</b>
            <ul>
              <li>In a case before the BGH on 3 March 2025, the court ruled that temporary withholding of a job position does not constitute intent to award.</li>
              <li>Dispute value determination was based on § 52 Abs. 6 Satz 1 Nr. 1 GKG.</li>
            </ul>
          </li>
          <li style={{ marginBottom: 14 }}>
            <b>Legal Implication</b>
            <ul>
              <li>Applies to administrative interim measures where immediate appointment is not the subject of litigation.</li>
              <li>Reinforces interpretation of GKG provisions for calculating Streitwert in urgent applications.</li>
            </ul>
          </li>
        </ol>
        <div style={{
          fontSize: 15, color: "#475f8e", marginTop: 24, lineHeight: 1.6
        }}>
          This report is generated based on real rulings from the German Federal Court.<br /><br />
          <b>AI-generated summaries are not legal advice. Please consult a licensed German lawyer for binding legal conclusions.</b>
        </div>
      </section>

      {/* === 캐나다 샘플 === */}
      <div style={{ marginBottom: 15, fontSize: 17 }}>
        <b>Canada Input Example</b> <br />
        <span style={{ color: "#444" }}>
          Federal Court of Canada<br />
          Case: <b>Ahmad v. Canada (Citizenship and Immigration), 2025 FC 245</b><br />
          Date: 28 February 2025 · URL: <a href="https://canlii.ca/t/j4k9n" target="_blank" rel="noopener">View Full Text</a>
        </span>
      </div>
      <section style={{
        background: "#fff",
        borderRadius: 12,
        padding: "28px 24px",
        boxShadow: "0 2px 12px #bdd3ff18",
        border: "1px solid #dde6fb",
        marginBottom: 24
      }}>
        <b>[AI Analysis Based on Real Federal Court of Canada Judgment]</b>
        <ol style={{ margin: "14px 0 0 16px", padding: 0 }}>
          <li style={{ marginBottom: 14 }}>
            <b>Case Overview</b>
            <ul>
              <li>The applicant challenged a negative decision on his refugee protection claim under the Immigration and Refugee Protection Act.</li>
              <li>The main ground alleged was procedural unfairness and failure to properly consider humanitarian and compassionate grounds.</li>
              <li>The Court reviewed the process and reasoning of the administrative tribunal.</li>
            </ul>
          </li>
          <li style={{ marginBottom: 14 }}>
            <b>Legal Issues & Key Analysis</b>
            <ul>
              <li>Whether the tribunal's decision failed to observe procedural fairness, especially with respect to evidence review and notice.</li>
              <li>Whether the humanitarian and compassionate grounds were adequately addressed as per Section 25(1) of IRPA.</li>
            </ul>
          </li>
          <li style={{ marginBottom: 14 }}>
            <b>Decision & Legal Risk</b>
            <ul>
              <li>The Court found deficiencies in the procedural approach, specifically regarding the right to present evidence and receive reasons.</li>
              <li>Key risk: Non-compliance with fairness standards in immigration hearings may result in decisions being overturned or remitted for reconsideration.</li>
            </ul>
          </li>
        </ol>
        <div style={{
          fontSize: 15, color: "#1d5955", marginTop: 24, lineHeight: 1.6
        }}>
          <b>Source: Official Federal Court of Canada database.</b> <br />
          <b>Disclaimer:</b> AI-generated report is for informational purposes only and is not legal advice.
        </div>
      </section>
      {/* === 인도 샘플 === */}
<div style={{ marginBottom: 15, fontSize: 17 }}>
  <b>India Input Example</b> <br />
  <span style={{ color: "#444" }}>
    Supreme Court of India<br />
    Case: <b>A. Raja vs D. Kumar</b><br />
    Date: 6 May 2025 · Case No: CIVIL APPEAL NO.2758 OF 2023
  </span>
</div>
<section style={{
  background: "#fff",
  borderRadius: 12,
  padding: "28px 24px",
  boxShadow: "0 2px 12px #bdd3ff18",
  border: "1px solid #dde6fb",
  marginBottom: 38
}}>
  <b>[AI Analysis Based on Real Supreme Court of India Judgment]</b>
  <ol style={{ margin: "14px 0 0 16px", padding: 0 }}>
    <li style={{ marginBottom: 14 }}>
      <b>Case Background</b>
      <ul>
        <li>This case concerns an appeal against the Kerala High Court's decision to void the election of the appellant, A. Raja, due to challenges over his eligibility as a Scheduled Caste candidate.</li>
        <li>The core legal issue centered on whether the appellant fulfilled the caste and residence requirements under the Representation of the People Act, 1951.</li>
      </ul>
    </li>
    <li style={{ marginBottom: 14 }}>
      <b>Key Legal Issues</b>
      <ul>
        <li>Whether A. Raja's caste certificate and residency met the statutory requirements to contest from a reserved constituency.</li>
        <li>Whether the evidence presented sufficiently proved conversion of religion or migration affecting eligibility.</li>
      </ul>
    </li>
    <li style={{ marginBottom: 14 }}>
      <b>Outcome & Legal Reasoning</b>
      <ul>
        <li>The Supreme Court found no conclusive proof invalidating the caste certificate or establishing ineligibility based on residence or religious conversion.</li>
        <li>The appeal was allowed; the High Court judgment was set aside, and the appellant's election was upheld.</li>
      </ul>
    </li>
    <li style={{ marginBottom: 14 }}>
      <b>Risk & Applicability</b>
      <ul>
        <li>Future challenges to reserved seat eligibility must be backed by strong, clear evidence, especially on caste, migration, and conversion.</li>
        <li>Important for all candidates in reserved constituencies: maintain rigorous documentation for community status.</li>
      </ul>
    </li>
  </ol>
  <div style={{
    fontSize: 15, color: "#5a2c0c", marginTop: 24, lineHeight: 1.6
  }}>
    <b>Source: Official Supreme Court of India judgment (2025).</b><br />
    <b>Disclaimer:</b> AI-generated summary. Not legal advice; consult an Indian legal professional for binding opinions.
  </div>
</section>
<div style={{
  fontSize: 15,
  color: "#a14040",
  marginTop: 24,
  lineHeight: 1.65,
  fontWeight: 700
}}>
  <b>Disclaimer:</b>  
  This AI-generated report is for informational and educational purposes only.  
  It does <b>not</b> constitute legal advice or create an attorney-client relationship.  
  For any legal matter, please consult a qualified lawyer in the relevant jurisdiction.<br /><br />
  Lawrithm exclusively uses official, public court documents and never stores or processes personal data.  
  Use of this platform is subject to our Terms of Service.
</div>
    </div>
  );
}
