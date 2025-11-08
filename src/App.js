import React from "react";
import ImageAnalyzer from './Image_Analyzer';


function App() {
  return (
    <div style={{ minHeight: "100vh", background: "#f8f8fc", padding: "50px 0" }}>
      <div style={{
        maxWidth: 600,
        margin: "0 auto",
        background: "#fff",
        borderRadius: 18,
        boxShadow: "0 8px 32px #0001",
        padding: 32
      }}>
        <h1 style={{
          textAlign: "center",
          fontWeight: 700,
          letterSpacing: "-2px",
          fontSize: 36
        }}>UI Screenshot Analyzer</h1>
        <p style={{
          color: "#444",
          textAlign: "center",
          marginBottom: 24
        }}>
          Drag & drop or select a screenshot to analyze UI elements and view Gemini insights.
        </p>
        <ImageAnalyzer />
      </div>
    </div>
  );
}

export default App;
