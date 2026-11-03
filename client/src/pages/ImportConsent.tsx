import {
  ArrowLeft,
  ArrowRight,
  Check,
  FileSpreadsheet,
  FileText,
  Globe,
  Layers3,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/landing/Navbar";
import "./ImportFlow.css";

const ImportConsent = () => {
  const [accepted, setAccepted] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar />
      <main className="import-page">
        <Link className="import-back-link" to="/dashboard">
          <ArrowLeft size={15} />
          Back to dashboard
        </Link>

        <section className="import-card consent-card">
          <div className="import-heading">
            <div className="import-icon">
              <ShieldCheck size={23} />
            </div>
            <div className="import-eyebrow">BEFORE YOU IMPORT</div>
            <h1>Your questions stay yours.</h1>
            <p>
              Here’s what happens to your questions when you bring them into
              ReviseHeap.
            </p>
          </div>

          <div className="source-list" aria-label="Supported import sources">
            <div className="source-item">
              <span className="source-icon"><FileText size={17} /></span>
              <span>PDF documents</span>
            </div>
            <div className="source-item">
              <span className="source-icon"><FileSpreadsheet size={17} /></span>
              <span>Google Sheets</span>
            </div>
            <div className="source-item">
              <span className="source-icon"><Globe size={17} /></span>
              <span>Chrome Extension</span>
              <small>LeetCode &amp; GeeksforGeeks</small>
            </div>
          </div>

          <div className="workflow-list">
            <div className="workflow-item">
              <span className="workflow-number">01</span>
              <div>
                <h2>Your imported questions are saved</h2>
                <p>
                  Imported questions will be available in your dashboard so you
                  can find and revisit them any time.
                </p>
              </div>
            </div>
            <div className="workflow-item">
              <span className="workflow-number">02</span>
              <div>
                <h2>Only supported questions go to your Heap</h2>
                <p>
                  Revision Heap works with LeetCode and GeeksforGeeks through
                  our Chrome Extension. Questions from other platforms stay in
                  your dashboard and won’t be added automatically.
                </p>
              </div>
            </div>
            <div className="workflow-item">
              <span className="workflow-number">03</span>
              <div>
                <h2>Review a question when you’re ready</h2>
                <p>
                  Use <strong>Go to Heap</strong> to open a supported question.
                  Solve it and submit a review with the extension; after it
                  submits successfully, the question is added to your Revision
                  Heap.
                </p>
              </div>
            </div>
          </div>

          <label className="consent-checkbox">
            <input
              type="checkbox"
              checked={accepted}
              onChange={(event) => setAccepted(event.target.checked)}
            />
            <span className="custom-checkbox" aria-hidden="true">
              {accepted && <Check size={13} />}
            </span>
            <span>
              I understand how my imported questions are saved and added to
              Revision Heap.
            </span>
          </label>

          <div className="consent-actions">
            <button
              className="import-primary-button"
              type="button"
              disabled={!accepted}
              onClick={() =>
                navigate("/dashboard/import/upload", {
                  state: { consentAccepted: true },
                })
              }
            >
              Continue to upload
              <ArrowRight size={16} />
            </button>
            <span className="consent-required">Consent is required to continue</span>
          </div>
        </section>

        <div className="import-footnote">
          <Layers3 size={14} />
          Your dashboard is the home for every question you import.
        </div>
      </main>
    </div>
  );
};

export default ImportConsent;
