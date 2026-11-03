import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  FileSpreadsheet,
  FileText,
  LockKeyhole,
  LoaderCircle,
  UploadCloud,
} from "lucide-react";
import { Link, Navigate, useLocation } from "react-router-dom";
import Navbar from "../components/landing/Navbar";
import "./ImportFlow.css";
import axios from "axios";
import { backendUrl } from "../lib/constants";
import { useState } from "react";

const ImportUpload = () => {
  const [uploadedDocumentName, setUploadedDocumentName] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [isPdf,setIsPdf] = useState(true);
  const [sheetUrl,setSheetUrl] = useState("");
  const location = useLocation();
  const consentAccepted = (
    location.state as { consentAccepted?: boolean } | null
  )?.consentAccepted;

  if (!consentAccepted) {
    return <Navigate to="/dashboard/import" replace />;
  }
 const handleGoogleSheetMigration = async() =>{
   try {
    if(!sheetUrl){
      console.log("paste a google sheet url")
    }
    const response = await axios.post(`${backendUrl}/api/migrate/googlesheet`,
      {googleSheetUrl:sheetUrl},
      {withCredentials:true}
    )
    console.log(response)
   } catch (error) {
    console.log(error);
   }
 }
  const handleUploadSheet = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setUploadError("");

    const formData = new FormData(event.currentTarget);
    const selectedFile = formData.get("sheet");
    if (!(selectedFile instanceof File) || selectedFile.size === 0) {
      setUploadError("Choose a document before uploading.");
      return;
    }

    setIsUploading(true);
    try {
      const response = await axios.post(
        `${backendUrl}/api/migrate/pdf/upload`,
        formData,
        { withCredentials: true },
      );
      const originalName: unknown = response.data?.file?.originalname;
      if (typeof originalName !== "string" || !originalName) {
        throw new Error("The server did not confirm the uploaded document.");
      }
      setUploadedDocumentName(originalName);
    } catch (error) {
      setUploadError(
        axios.isAxiosError(error)
          ? (error.response?.data?.message ?? "Could not upload the document.")
          : error instanceof Error
            ? error.message
            : "Could not upload the document.",
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar />
      <main className="import-page upload-page">
        <Link className="import-back-link" to="/dashboard/import">
          <ArrowLeft size={15} />
          Back to consent
        </Link>

        <section className="import-card upload-card">
          <div className="upload-stepper" aria-label="Import steps">
            <span className="step-complete">
              <span>1</span> Consent
            </span>
            <span className="step-connector" />
            <span className="step-current">
              <span>2</span> Upload
            </span>
          </div>

          <div className="import-heading upload-heading">
            <div className="import-icon">
              <UploadCloud size={24} />
            </div>
            <div className="import-eyebrow">YOUR QUESTION LIBRARY</div>
            <h1>Bring your questions along.</h1>
            <p>
              Choose a document to get your question library ready to import.
              Your questions will be saved to your dashboard.
            </p>
          </div>
          
          {isPdf &&<div className="upload-dropzone">
            <div className="upload-cloud-icon">
              <UploadCloud size={25} />
            </div>
            <h2>Upload a document</h2>
            <p>Drop your PDF or spreadsheet here</p>

            <form
              className="upload-form"
              onSubmit={handleUploadSheet}
              method="post"
              encType="multipart/form-data"
            >
              <input
                className="upload-select-button"
                type="file"
                name="sheet"
                accept=".pdf,.csv,.xls,.xlsx"
                disabled={isUploading}
                required
              />
              <button
                className="import-primary-button"
                type="submit"
                disabled={isUploading}
              >
                {isUploading ? (
                  <>
                    <LoaderCircle className="upload-loading-icon" size={16} />
                    Uploading...
                  </>
                ) : (
                  "Upload document"
                )}
              </button>
            </form>
          </div>}
           {!isPdf && 
           <div className="upload-dropzone">
<div className="sheet-url-wrapper">
  <textarea
    className="sheet-url-area"
    placeholder="Paste your Google Sheets link here..."
    value={sheetUrl}
    onChange={(e) => setSheetUrl(e.target.value)}
    rows={4}
    spellCheck={false}
  />

  <span className="sheet-url-hint">
    Supports Google Sheets sharing links
  </span>
</div>          </div>
           }
          {uploadError && (
            <div className="upload-error" role="alert">
              {uploadError}
            </div>
          )}

          {uploadedDocumentName && (
            <div className="uploaded-document" role="status">
              <FileText size={20} />
              <div className="uploaded-document-details">
                <span>Uploaded document</span>
                <strong>{uploadedDocumentName}</strong>
              </div>
              <CheckCircle2
                className="uploaded-document-success"
                size={19}
                aria-label="Upload complete"
              />
            </div>
          )}

          <div className="upload-source-note">
            <div className="upload-source-item">
              <FileText size={17} />
              <button onClick={() => setIsPdf(true)}>PDF documents</button>
            </div>
            <div className="upload-source-divider" />
            <div className="upload-source-item">
              <FileSpreadsheet size={17} />
              <button onClick={() => setIsPdf(false)}>Google Sheets</button>
            </div>
          </div>

          <div className="upload-privacy-note">
            <LockKeyhole size={15} />
            <span>
              Your uploaded document will appear here after the upload is
              confirmed.
            </span>
          </div>

          <div className="upload-actions">
            <Link className="upload-back-button" to="/dashboard/import">
              <ArrowLeft size={15} />
              Back
            </Link>
            <button className="import-primary-button" type="button" onClick={!isPdf?handleGoogleSheetMigration:handleGoogleSheetMigration}>
              Start import
              <ArrowRight size={16} />
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ImportUpload;
