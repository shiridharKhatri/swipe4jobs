import React from "react";
import Navbar from "./Navbar";

export default function Heading({ title }) {
  return (
    <section className="heading">
      <Navbar />
      <div className="head-title">
        <h1>{title}</h1>
      </div>
    </section>
  );
}
