import React from "react";
import "../styles/Loader.css"
export default function ButtonLoader(props) {
  return (
    <div className="buttonLoader" >
      <div className="dot dotOne" style={{background:props.background}}></div>
      <div className="dot dotTwo" style={{background:props.background}}></div>
      <div className="dot dotThree" style={{background:props.background}}></div>
    </div>
  );
}
