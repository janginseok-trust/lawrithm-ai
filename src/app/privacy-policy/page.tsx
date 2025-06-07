"use client";

import styles from "./page.module.css";

export default function PrivacyPolicyPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Privacy Policy</h1>

      <p>
        CoreAxis Labs (“Company”, “we”, “us”, or “our”) is committed to protecting your privacy and handles your information in accordance with all applicable data protection laws.
      </p>

      <h2 className={styles.sectionTitle}>1. Data Collection and Purpose</h2>
      <p className={styles.text}>
        We do <b>not</b> collect, store, or process any personal information or uploaded files from users of our AI legal automation service, except as strictly necessary for service operation (e.g., temporary processing for generating reports).
      </p>

      <h2 className={styles.sectionTitle}>2. Information We Do Not Store</h2>
      <p className={styles.text}>
        • We do not store your name, email, or any user-submitted content.<br />
        • Uploaded documents and case information are processed in-memory and deleted immediately after generating your report.<br />
        • No cookies or tracking pixels are used for advertising or behavioral profiling.
      </p>

      <h2 className={styles.sectionTitle}>3. Data Retention</h2>
      <p className={styles.text}>
        All input data is deleted immediately after report generation. We do not retain any personal information or document files on our servers.
      </p>

      <h2 className={styles.sectionTitle}>4. Security</h2>
      <p className={styles.text}>
        We implement industry-standard security measures to protect your data during processing and transmission. No data is stored or retained beyond your active session.
      </p>

      <h2 className={styles.sectionTitle}>5. User Rights</h2>
      <p className={styles.text}>
        Since we do not store any user data, there is no information to view, modify, or delete. If you have questions, you may contact us at any time.
      </p>

      <h2 className={styles.sectionTitle}>6. Contact</h2>
      <p className={styles.text}>
        Data Protection Officer: Inseok Jang<br />
        Email: 589second@gmail.com
      </p>

      <p className={styles.smallText}>
        This privacy policy is effective as of May 30, 2025.
      </p>
    </div>
  );
}
