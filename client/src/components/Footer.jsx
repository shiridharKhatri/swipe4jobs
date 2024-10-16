import React from "react";
import { Link } from "react-router-dom";
export default function Footer() {
  return (
    <footer>
      <div className="first-section">
        <p className="copyright">&copy; Copyright 2024 Swipe 4 Jobs </p>
        <div className="second-section">
          <Link to="/terms-of-use" aria-label="terms of use link">
            Terms of Use
          </Link>
        </div>
      </div>
    </footer>
  );
}
