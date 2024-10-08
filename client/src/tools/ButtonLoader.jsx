import React from "react";
import "../styles/Loader.css"
export default function ButtonLoader(props) {
  return (
    <div className="buttonLoader" style={{background:props.background}}>
      <div className="dot dotOne"></div>
      <div className="dot dotTwo"></div>
      <div className="dot dotThree"></div>
    </div>
  );
}
