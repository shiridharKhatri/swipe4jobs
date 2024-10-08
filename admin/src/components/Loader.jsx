import React from "react";

export default function Loader(props) {
  return (
    <section className="loader" style={{position:props.position}}>
      <div className="cube">
        <div className="cube_item cube_x"></div>
        <div className="cube_item cube_y"></div>
        <div className="cube_item cube_y"></div>
        <div className="cube_item cube_x"></div>
      </div>
    </section>
  );
}
