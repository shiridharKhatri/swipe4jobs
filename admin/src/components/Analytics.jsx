import React from "react";
import TopDetails from "./TopDetails";
export default function Analytics(props) {
  return (
    <section className="section">
      <TopDetails title="Analytics" navbar={props.navContainerRef}/>
    </section>
  );
}
