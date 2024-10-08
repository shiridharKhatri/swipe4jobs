import React from "react";
import Navbar from "./Navbar";
export default function Header(props) {
  return (
    <header>
      <Navbar />
      <div className="head-container">
        <div className="text-section">
          <h1>
            {props.firstText}<span>{props.secondHeighlightText}</span>{props.lastText}
          </h1>
          <p> {props.byline}</p>
        </div>
      </div>
    </header>
  );
}
