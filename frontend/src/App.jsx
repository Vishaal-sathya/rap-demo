import React from "react";
import TrainSearchPage from "./pages/TrainSearchPage";
import "./index.css";

export default function App() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f0f9ff 0%, #e0e7ff 100%)",
      }}
    >
      <header className="header">
        <div className="container">
          <div className="header-content">
            <div className="logo-section">
              <div className="logo">
                Railway<span className="logo-accent">Go</span>
              </div>
              <div className="tagline">Your journey begins here</div>
            </div>
            <nav className="nav">
              <a href="#">Home</a>
              <a href="#">My Bookings</a>
              <a href="#">Help</a>
            </nav>
          </div>
        </div>
      </header>

      <main className="main">
        <div className="container">
          <TrainSearchPage />
        </div>
      </main>
    </div>
  );
}
