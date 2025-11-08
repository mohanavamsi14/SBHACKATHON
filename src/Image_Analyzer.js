import React, { useState, useRef } from "react";
import axios from "axios";

export default function ImageAnalyzer() {
  const [file, setFile] = useState(null);
  const [imgURL, setImgURL] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef();

  const onDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    handleFile(droppedFile);
  };

  const handleFile = (fileObj) => {
    if (fileObj && fileObj.type.startsWith("image/")) {
      setFile(fileObj);
      setImgURL(URL.createObjectURL(fileObj));
      setAnalysis(null);
      setError("");
    } else {
      setError("Please select a valid image file!");
    }
  };

  const triggerInput = () => inputRef.current.click();

  const handleChange = (e) => {
    handleFile(e.target.files[0]);
  };

  const analyzeImage = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    setError("");
    try {
      const resp = await axios.post("http://localhost:8000/analyze", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setAnalysis(resp.data);
    } catch (err) {
      setError("Upload or analysis failed. Check console for details.");
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div>
      <div
        onDrop={onDrop}
        onDragOver={e => e.preventDefault()}
        onClick={triggerInput}
        style={{
          cursor: "pointer",
          border: "2px dashed #8888ff",
          padding: 32,
          borderRadius: 16,
          background: "#fafbff",
          textAlign: "center",
          marginBottom: 12,
          transition: "border 0.2s",
          ...(file && { borderColor: "#31c48d" })
        }}
      >
        <input
          type="file"
          ref={inputRef}
          style={{ display: "none" }}
          accept="image/*"
          onChange={handleChange}
        />
        {!imgURL ? (
          <div style={{ color: "#888", fontSize: 18 }}>
            <b>Click to browse</b> or drag and drop an image file here
          </div>
        ) : (
          <img
            src={imgURL}
            alt="Selected"
            style={{
              width: "60%",
              maxHeight: 200,
              margin: "auto",
              display: "block",
              objectFit: "contain",
              borderRadius: 10,
              boxShadow: "0 4px 18px #0002"
            }}
          />
        )}
      </div>
      <button
        onClick={analyzeImage}
        disabled={!file || loading}
        style={{
          background: "linear-gradient(90deg, #667eea, #31c48d)",
          color: "#fff",
          border: "none",
          fontWeight: 600,
          padding: "10px 26px",
          borderRadius: 7,
          textTransform: "uppercase",
          fontSize: 16,
          boxShadow: "0 2px 8px #667eea17",
          cursor: !file || loading ? "not-allowed" : "pointer",
          transition: "background 0.2s",
          marginBottom: 20,
          marginTop: 5,
          outline: "none"
        }}
      >
        {loading ? (
          <span style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10
          }}>
            <span className="loader" style={{
              width: 18,
              height: 18,
              border: "3px solid #fff",
              borderTop: "3px solid #f4e",
              borderRadius: "50%",
              display: "inline-block",
              animation: "spin 1s linear infinite"
            }} />
            Analyzing...
          </span>
        ) : "Analyze Screenshot"}
      </button>
      {error && <div style={{
        color: "#e74c3c", margin: "12px 0", fontWeight: 500
      }}>{error}</div>}
      {analysis && (
        <div style={{
          marginTop: 24,
          background: "#f9fafb",
          borderRadius: 12,
          padding: 18,
          fontSize: 15,
          boxShadow: "0 2px 8px #bbb2"
        }}>
          <h3 style={{ color: "#3b4adc" }}>Detections</h3>
          <pre style={{
            background: "#f6f6f6",
            padding: 10,
            borderRadius: 7,
            marginBottom: 14,
            fontSize: 13,
            maxHeight: 200,
            overflow: "auto"
          }}>
            {JSON.stringify(analysis.detections, null, 2)}
          </pre>
          <h3 style={{ color: "#00a76f" }}>Gemini Summary</h3>
          <pre style={{
            background: "#f6f6f6",
            padding: 10,
            borderRadius: 7,
            fontSize: 13,
            maxHeight: 400,
            overflow: "auto"
          }}>
            {JSON.stringify(analysis.gemini_summary, null, 2)}
          </pre>
        </div>
      )}
      <style>
        {`
          @keyframes spin { 100% { transform: rotate(360deg); } }
        `}
      </style>
    </div>
  );
}
