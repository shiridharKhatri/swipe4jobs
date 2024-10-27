import React, { useContext, useEffect, useState } from "react";
import Header from "../components/Header";
import TrendingPost from "../components/TrendingPost";
import Footer from "../components/Footer";
export default function Root() {
  useEffect(() => {
    window.document.title = "SWIPE 4 JOBS | Home";
  }, []);
  return (
    <>
      <Header
        firstText="SWIPE"
        secondHeighlightText="4"
        lastText="JOBS"
        byline="The easiest and fastest method to secure a career"
      />
      <TrendingPost />
      <Footer />
    </>
  );
}
